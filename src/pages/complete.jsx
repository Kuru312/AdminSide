import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/order.css'; // Reuse the same CSS file as Order.jsx
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourierPanel = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // For search input

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
      const response = await fetch(`http://localhost:5001/courierpanel/${orderId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Delivered' }),
      });

      if (response.ok) {
        toast.success('Order status updated to Delivered!');
        // Update the order status in the state
        setOrders(orders.map(order => order._id === orderId ? { ...order, status: 'Delivered' } : order));
      } else {
        toast.error('Failed to update order status.');
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error('Error updating order status.');
    }
  };

  // Filter orders based on the search query
  const filteredOrders = orders.filter(order => {
    const fullName = `${order.address.firstName} ${order.address.lastName}`;
    const searchQueryLower = searchQuery.toLowerCase();
    return (
      order._id.toLowerCase().includes(searchQueryLower) || 
      fullName.toLowerCase().includes(searchQueryLower)
    );
  });

  return (
    <main className="container mt-4">
      {/* Header Section */}
      <div className="header d-flex justify-content-between align-items-center mb-4">
        <h2>Delivered and Orders</h2>
        <input 
          type="text"
          placeholder="Search by Order ID or Customer Name"
          className="form-control"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
              <th>Date</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.address.firstName} {order.address.lastName}</td>
                  <td>{order.items.map(item => item.name).join(', ')}</td>
                  <td>{order.status}</td>
                  <td>${order.amount}</td>
                  <td>{order.date}</td>
                  <td>{order.address.street}, {order.address.city}, {order.address.state}, {order.address.zip}</td>
                  <td><button className="btn btn-info" onClick={() => handleDelivered(order._id)}>Delivered</button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No orders found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer /> {/* Add ToastContainer to render toast notifications */}
    </main>
  );
};

export default CourierPanel;
