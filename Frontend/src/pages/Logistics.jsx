import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/order.css'; // Reuse the same CSS file as Order.jsx
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Logistics = () => {
  const [orders, setOrders] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [courierPanel, setCourierPanel] = useState([]); 
  const [trades, setTrades] = useState([]); // State to hold trades data
  const [users, setUsers] = useState([]); // State to hold user data
  const [refunds, setRefunds] = useState([]); // State to hold refunds data
  const [selectedCouriers, setSelectedCouriers] = useState({});
  const [showLogistics, setShowLogistics] = useState(true); // State to toggle logistics visibility
  const [showTrades, setShowTrades] = useState(false); // State to toggle trades visibility
  const [showRefunds, setShowRefunds] = useState(false); // State to toggle refunds visibility

  // Fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await fetch('https://adminside-lo8s.onrender.com/logistics');
      const data = await response.json();
      setOrders(data); // Fetch orders from the Logistics collection
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error('Error fetching orders.');
    }
  };

  // Fetch couriers from the backend
  const fetchCouriers = async () => {
    try {
      const response = await fetch('https://adminside-lo8s.onrender.com/couriers');
      const data = await response.json();
      setCouriers(data);
    } catch (error) {
      console.error("Error fetching couriers:", error);
      toast.error('Error fetching couriers.');
    }
  };

  // Fetch courier panel data from the backend
  const fetchCourierPanel = async () => {
    try {
      const response = await fetch('https://adminside-lo8s.onrender.com/courierpanel');
      const data = await response.json();
      setCourierPanel(data);
    } catch (error) {
      console.error("Error fetching courier panel:", error);
      toast.error('Error fetching courier panel.');
    }
  };

  // Fetch trades data from the backend
  const fetchTrades = async () => {
    try {
      const response = await fetch('https://adminside-lo8s.onrender.com/trades');
      const data = await response.json();
      setTrades(data); // Set trades data

      // Now fetch the users to map sellerFrom and sellerTo to names
      const userResponse = await fetch('https://adminside-lo8s.onrender.com/users');
      const userData = await userResponse.json();
      setUsers(userData); // Store users data
    } catch (error) {
      console.error("Error fetching trades:", error);
      toast.error('Error fetching trades.');
    }
  };

  // Fetch refunds data from the backend
  const fetchRefunds = async () => {
    try {
      const response = await fetch('https://adminside-lo8s.onrender.com/refunds');
      const data = await response.json();
      setRefunds(data); // Set refunds data
    } catch (error) {
      console.error("Error fetching refunds:", error);
      toast.error('Error fetching refunds.');
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCouriers();
    fetchCourierPanel();
    fetchTrades();
    fetchRefunds();
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

  // Function to get the user name by ID
  const getUserNameById = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.name : 'Unknown User'; // Return name or 'Unknown User' if not found
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
      const response = await fetch(`https://adminside-lo8s.onrender.com/logistics/${orderId}/remove-courier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courierId }),
      });

      if (response.ok) {
        toast.success('Courier removed successfully!');
        fetchOrders();
        fetchCourierPanel();
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
      const courierResponse = await fetch(`https://adminside-lo8s.onrender.com/couriers/${courierId}`);
      if (!courierResponse.ok) {
        throw new Error('Failed to fetch courier');
      }
      const courierData = await courierResponse.json();
      const courierName = courierData.name;
  
      const response = await fetch(`https://adminside-lo8s.onrender.com/logistics/${orderId}/assign-courier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courierId, status: `Pick Up by Courier ${courierName}` }),
      });
  
      if (response.ok) {
        toast.success(`Courier ${courierName} assigned, status updated to "Pick Up by Courier ${courierName}", and order moved to CourierPanel successfully!`);
        fetchOrders();
        fetchCourierPanel();
      } else {
        toast.error('Failed to assign courier.');
      }
    } catch (error) {
      console.error("Error assigning courier:", error);
      toast.error('Error assigning courier.');
    }
  };

  const handleConfirmRefund = async (refundId) => {
    try {
      const response = await fetch(`https://adminside-lo8s.onrender.com/refunds/${refundId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        toast.success('Refund confirmed successfully!');
        fetchRefunds(); // Refresh the refunds data
      } else {
        toast.error('Failed to confirm refund.');
      }
    } catch (error) {
      console.error("Error confirming refund:", error);
      toast.error('Error confirming refund.');
    }
  };
  
  const handleRejectRefund = async (refundId) => {
    try {
      const response = await fetch(`https://adminside-lo8s.onrender.com/refunds/${refundId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        toast.success('Refund rejected successfully!');
        fetchRefunds(); // Refresh the refunds data
      } else {
        toast.error('Failed to reject refund.');
      }
    } catch (error) {
      console.error("Error rejecting refund:", error);
      toast.error('Error rejecting refund.');
    }
  };

  return (
    <main className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Logistics Management</h2>
        <div>
          <button 
            className="btn btn-primary me-2"
            onClick={() => { setShowLogistics(true); setShowTrades(false); setShowRefunds(false); }}
          >
            Logistics Management
          </button>
          <button 
            className="btn btn-secondary me-2"
            onClick={() => { setShowTrades(true); setShowLogistics(false); setShowRefunds(false); }}
          >
            Trade History
          </button>
          {/* <button 
            className="btn btn-secondary"
            onClick={() => { setShowRefunds(true); setShowLogistics(false); setShowTrades(false); }}
          >
            Return
          </button> */}
        </div>
      </div>

      {/* Logistics Section */}
      {showLogistics && (
        <div className="order-table">
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
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
                  <td>{order.status}</td>
                  <td>₱{order.amount}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={selectedCouriers[order._id] || ''}
                      onChange={(e) => handleCourierChange(order._id, e.target.value)}
                      disabled={order.courierId}
                    >
                      <option value="">Select Courier</option>
                      {couriers.map(courier => {
                        const assignedCouriers = getAssignedCourierIds();
                        if (assignedCouriers.has(courier._id) || order.courierId) {
                          return null;
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
                          removeCourierAssignment(order._id, order.courierId);
                        } else {
                          assignCourier(order._id, selectedCouriers[order._id]);
                        }
                      }}
                      disabled={!selectedCouriers[order._id] || order.courierId}
                    >
                      {order.courierId ? 'Reassign Courier' : 'Assign Courier'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Trades Section */}
      {showTrades && (
        <div className="order-table">
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th>Trade ID</th>
                <th>Seller From</th>
                <th>Seller To</th>
                <th>Status</th>
                <th>Quantity</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {trades.map(trade => (
                <tr key={trade._id}>
                  <td>{trade._id}</td>
                  <td>{getUserNameById(trade.sellerFrom)}</td>
                  <td>{getUserNameById(trade.sellerTo)}</td>
                  <td>{trade.status}</td>
                  <td>{trade.quantity}</td>
                  <td>{new Date(trade.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer /> {/* Add ToastContainer to render toast notifications */}
    </main>
  );
};

export default Logistics;