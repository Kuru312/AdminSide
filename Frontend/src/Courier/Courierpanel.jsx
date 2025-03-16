import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/order.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourierPanel = () => {
  const [orders, setOrders] = useState([]);  // This is your state to hold orders
  const [loading, setLoading] = useState(true); // Set loading to true initially for orders fetching
  const [deliveringOrderId, setDeliveringOrderId] = useState(null); // Track which order is being delivered

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://adminside-lo8s.onrender.com/courierpanel/orders`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []); // Set orders from the response
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error('Error fetching orders.');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchOrders();
  }, []);

  const handleDelivered = async (orderId) => {
    setDeliveringOrderId(orderId); // Set the order being processed
    try {
      const response = await fetch(`https://adminside-lo8s.onrender.com/moveToCompleteOrders/${orderId}`, {
        method: 'POST',
      });

      if (response.ok) {
        // Successfully moved to completed
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId)); // Remove from courierpanel
        
        toast.success("Order Delivered Successfully");

        // Optionally, you can update status locally
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId ? { ...order, status: 'Delivered' } : order
          )
        );
      } else {
        let errorMessage = 'Failed to move order to completed';
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          console.error("Error parsing JSON error response:", jsonError);
        }
        console.error('Error moving order to completed:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error in request:', error);
      toast.error("Network Error");
    } finally {
      setDeliveringOrderId(null); // Reset after processing
    }
  };

  return (
    <main className="container mt-4">
      <div className="header d-flex justify-content-between align-items-center mb-4">
        <h2>Assigned Orders</h2>
      </div>

      <div className="order-table">
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Status</th>
              <th>Total</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">Loading...</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.address.firstName} {order.address.lastName}</td>
                  <td>{order.status}</td>
                  <td>₱{order.amount}</td>
                  <td>{order.address.street}, {order.address.city}, {order.address.state}, {order.address.zip}</td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={() => handleDelivered(order._id)}
                      disabled={deliveringOrderId === order._id || order.status === 'Delivered'} // Disable if already delivered or processing
                    >
                      {deliveringOrderId === order._id ? "Processing..." : "Delivered"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </main>
  );
};

export default CourierPanel;
