import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/order.css'; // Reuse the same CSS file as Order.jsx
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Logistics = () => {
  const [orders, setOrders] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState({});

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

  useEffect(() => {
    fetchOrders();
    fetchCouriers();
  }, []);

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
                <td>${order.amount}</td>
                <td>{order.date}</td>
                <td>
                  <select
                    value={selectedCourier.orderId === order._id ? selectedCourier.courierId : ''}
                    onChange={(e) => setSelectedCourier({ orderId: order._id, courierId: e.target.value })}
                  >
                    <option value="">Select Courier</option>
                    {couriers.map(courier => (
                      <option key={courier._id} value={courier._id}>{courier.name}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={() => assignCourier(order._id, selectedCourier.courierId)}
                  >
                    Assign Courier
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