import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/order.css'; // Reuse the same CSS file as Order.jsx
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourierPanel = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch all orders from the courierpanel collection
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:5001/courierpanel/orders`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error('Error fetching orders.');
      }
    };

    fetchOrders();
  }, []);

  const handleDelivered = async (orderId) => {
    try {
      // Send a POST request to update the status to "Delivered" and remove the courierId
      const response = await fetch(`http://localhost:5001/courierpanel/${orderId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Delivered', courierId: null }), // Set courierId to null to remove it
      });
  
      if (response.ok) {
        toast.success('Order status updated to Delivered and courier removed!');
        
        // Update the order status and remove the courierId in the state
        setOrders(orders.map(order => order._id === orderId ? { ...order, status: 'Delivered', courierId: null } : order));
      } else {
        toast.error('Failed to update order status.');
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error('Error updating order status.');
    }
  };
  
  return (
    <main className="container mt-4">
      {/* Header Section */}
      <div className="header d-flex justify-content-between align-items-center mb-4">
        <h2>Assigned Orders</h2>
      </div>

      {/* Orders Table Section */}
      <div className="order-table">
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Product</th>
              <th>Status</th>
              <th>Total</th>
              <th>Address</th>
              <th>Action</th>
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
                <td>{order.address.street}, {order.address.city}, {order.address.state}, {order.address.zip}</td>
                <td><button className="btn btn-info" onClick={() => handleDelivered(order._id)}>Delivered</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer /> {/* Add ToastContainer to render toast notifications */}
    </main>
  );
};

export default CourierPanel;