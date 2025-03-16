import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/order.css'; // Reuse the same CSS file as Order.jsx
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourierPanel = () => {
  const [orders, setOrders] = useState([]); // Ongoing orders
  const [completedOrders, setCompletedOrders] = useState([]); // Completed orders
  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const [activeSection, setActiveSection] = useState('ongoing'); // Active section ("ongoing" or "completed")

  useEffect(() => {
    // Fetch ongoing orders from the courierpanel collection
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:5001/courierpanel/orders`); // Endpoint for ongoing deliveries
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching ongoing orders:", error);
        toast.error('Error fetching ongoing orders.');
      }
    };

    // Fetch completed orders from the completeorders collection
    const fetchCompletedOrders = async () => {
      try {
        const response = await fetch(`https://admin-sideapi.vercel.app/completeorders`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCompletedOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching completed orders:", error);
        toast.error('Error fetching completed orders.');
      }
    };
    
    fetchOrders();
    fetchCompletedOrders();
  }, []); // Empty dependency array to run only once when component mounts

  // Filter ongoing orders based on the search query
  const filteredOngoingOrders = orders.filter(order => {
    const fullName = `${order.address.firstName} ${order.address.lastName}`;
    const searchQueryLower = searchQuery.toLowerCase();
    return (
      order._id.toLowerCase().includes(searchQueryLower) || 
      fullName.toLowerCase().includes(searchQueryLower)
    );
  });

  // Filter completed orders based on the search query
  const filteredCompletedOrders = completedOrders.filter(order => {
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
        <h2>Delivery and Complete</h2>
        <input 
          type="text"
          placeholder="Search by Order ID or Customer Name"
          className="form-control"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Toggle Buttons */}
      <div className="toggle-buttons mb-4 text-center">
        <button
          onClick={() => setActiveSection('ongoing')}
          className={`btn ${activeSection === 'ongoing' ? 'active' : ''}`}
        >
          Ongoing Deliveries
        </button>
        <button
          onClick={() => setActiveSection('completed')}
          className={`btn ${activeSection === 'completed' ? 'active' : ''}`}
        >
          Completed Deliveries
        </button>
      </div>

      {/* Ongoing Deliveries Table */}
      {activeSection === 'ongoing' && (
        <div className="order-table">
          <h3>Ongoing Deliveries</h3>
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredOngoingOrders.length > 0 ? (
                filteredOngoingOrders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.address.firstName} {order.address.lastName}</td>
                    <td>{order.status}</td>
                    <td>₱{order.amount}</td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                    <td>{order.address.street}, {order.address.city}, {order.address.state}, {order.address.zip}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No ongoing deliveries found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Completed Deliveries Table */}
      {activeSection === 'completed' && (
        <div className="order-table mt-5">
          <h3>Completed Deliveries</h3>
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompletedOrders.length > 0 ? (
                filteredCompletedOrders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.userId}</td> {/* Display User ID */}
                    <td>{order.address.firstName} {order.address.lastName}</td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                    <td>{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No completed deliveries found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer /> {/* Add ToastContainer to render toast notifications */}
    </main>
  );
};

export default CourierPanel;
