import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/order.css'; // Reuse the same CSS file as Order.jsx
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Logistics = () => {
  const [orders, setOrders] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [courierPanel, setCourierPanel] = useState([]); // Add state for courierPanel data
  const [selectedCouriers, setSelectedCouriers] = useState({});

  // Fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5001/logistics');
      const data = await response.json();
      setOrders(data); // Fetch orders from the Logistics collection
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Fetch couriers from the backend
  const fetchCouriers = async () => {
    try {
      const response = await fetch('http://localhost:5001/couriers'); // Assuming couriers endpoint is used for couriers
      const data = await response.json();
      setCouriers(data);
    } catch (error) {
      console.error("Error fetching couriers:", error);
    }
  };

  // Fetch courier panel data from the backend
  const fetchCourierPanel = async () => {
    try {
      const response = await fetch('http://localhost:5001/courierpanel'); // Assuming courierPanel endpoint is used for courierPanel data
      const data = await response.json();
      setCourierPanel(data); // Set courierPanel data
    } catch (error) {
      console.error("Error fetching courier panel:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCouriers();
    fetchCourierPanel(); // Fetch courierPanel data
  }, []);

  // Get a list of courier IDs that are already assigned to any order in the courierPanel
  const getAssignedCourierIds = () => {
    const assignedCouriers = new Set();
    courierPanel.forEach(panelOrder => {
      if (panelOrder.courierId) {
        assignedCouriers.add(panelOrder.courierId); // Add the courierId from courierPanel
      }
    });
    return assignedCouriers;
  };

  // Handle courier selection for each order
  const handleCourierChange = (orderId, courierId) => {
    setSelectedCouriers((prevState) => ({
      ...prevState,
      [orderId]: courierId,
    }));
  };

  // Remove courier assignment from the courierPanel collection
  const removeCourierAssignment = async (orderId, courierId) => {
    try {
      const response = await fetch(`http://localhost:5001/logistics/${orderId}/remove-courier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courierId }),
      });

      if (response.ok) {
        toast.success('Courier removed successfully!');
        fetchOrders(); // Refresh the orders list
        fetchCourierPanel(); // Refresh the courier panel
      } else {
        toast.error('Failed to remove courier.');
      }
    } catch (error) {
      console.error("Error removing courier:", error);
      toast.error('Error removing courier.');
    }
  };

  // Assign a courier to an order
  const assignCourier = async (orderId, courierId) => {
    try {
      // Fetch the courier's name based on the courierId
      const courierResponse = await fetch(`http://localhost:5001/couriers/${courierId}`);
      if (!courierResponse.ok) {
        throw new Error('Failed to fetch courier');
      }
      const courierData = await courierResponse.json();
      const courierName = courierData.name;
  
      const response = await fetch(`http://localhost:5001/logistics/${orderId}/assign-courier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courierId, status: `Pick Up by Courier ${courierName}` }), // Update status with courier name
      });
  
      if (response.ok) {
        toast.success(`Courier ${courierName} assigned, status updated to "Pick Up by Courier ${courierName}", and order moved to CourierPanel successfully!`);
        fetchOrders(); // Refresh the orders list
        fetchCourierPanel(); // Refresh the courier panel
      } else {
        toast.error('Failed to assign courier.');
      }
    } catch (error) {
      console.error("Error assigning courier:", error);
      toast.error('Error assigning courier.');
    }
  };

  return (
    <main className="container mt-4">
      {/* Header Section */}
      <div className="header d-flex justify-content-between align-items-center mb-4">
        <h2>Logistics Management</h2>
      </div>

      {/* Order Table Section */}
      <div className="order-table">
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Product</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
              <th>Courier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.address.firstName} {order.address.lastName}</td>
                <td>{order.items.map(item => item.name).join(', ')}</td>
                <td>{order.status}</td>
                <td>₱{order.amount}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>
                  <select
                    value={selectedCouriers[order._id] || ''}
                    onChange={(e) => handleCourierChange(order._id, e.target.value)}
                    disabled={order.courierId} // Disable the dropdown if the order already has a courier
                  >
                    <option value="">Select Courier</option>
                    {couriers.map(courier => {
                      // Get all assigned courier IDs from the courierPanel collection
                      const assignedCouriers = getAssignedCourierIds();
                      // If the courier is already assigned, exclude them from the dropdown
                      if (assignedCouriers.has(courier._id) || order.courierId) {
                        return null; // Do not display assigned couriers in the dropdown
                      }
                      return (
                        <option key={courier._id} value={courier._id}>
                          {courier.name}
                        </option>
                      );
                    })}
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={() => {
                      if (order.courierId) {
                        removeCourierAssignment(order._id, order.courierId); // Remove the previous courier if it's being reassigned
                      } else {
                        assignCourier(order._id, selectedCouriers[order._id]);
                      }
                    }}
                    disabled={!selectedCouriers[order._id] || order.courierId} // Disable button if no courier is selected or if the order already has a courier
                  >
                    {order.courierId ? 'Reassign Courier' : 'Assign Courier'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer /> {/* Add ToastContainer to render toast notifications */}
    </main>
  );
};

export default Logistics;
