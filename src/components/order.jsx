import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './order.css';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Order = () => {
  const [orders, setOrders] = useState([]);  // State to store the orders data
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch orders from the backend
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5001/orders');  // Replace with the correct backend endpoint
        const data = await response.json();
        setOrders(data);  // Store fetched orders data in 'orders' state
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();  // Fetch orders when the component mounts
  }, []);

  const handleShipOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5001/orders/${orderId}/ship`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update the order status in the state and remove it from the view
        setOrders(orders.filter(order => order._id !== orderId));
        toast.success('Order shipped successfully!');
        // Navigate to the Logistics page
        navigate('/logistics');
      } else {
        console.error("Error shipping order:", response.statusText);
        toast.error('Failed to ship order');
      }
    } catch (error) {
      console.error("Error shipping order:", error);
      toast.error('Failed to ship order');
    }
  };

  return (
    <main className="container mt-4">
      {/* Header Section */}
      <div className="header d-flex justify-content-between align-items-center mb-4">
        <h2>Order Management</h2>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.address.firstName} {order.address.lastName}</td>
                <td>{order.items.map(item => item.name).join(', ')}</td> {/* Assuming the items have a 'name' field */}
                <td>{order.status}</td>
                <td>${order.amount}</td>
                <td>{order.date}</td>
                <td>
                  {/* You can add action buttons here like Edit, Delete */}
                  <Link to={`/orderdetails/${order._id}`} className="btn btn-info me-2">View</Link>
                  <button className="btn btn-info" onClick={() => handleShipOrder(order._id)}>Ship</button>
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

export default Order;