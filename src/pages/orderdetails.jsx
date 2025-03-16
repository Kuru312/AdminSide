import './application.css'; // Make sure you have the right CSS file imported
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { id } = useParams(); // Get the order ID from the URL parameters
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`https://admin-sideapi.vercel.app/orders/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Order not found');
          } else {
            throw new Error('Network response was not ok');
          }
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchOrderDetails();
  }, [id]);

  return (
    <div className="order-details-container">
      <h3 className="order-title">Order Details</h3>
      {isLoading ? (
        <div className="loading-indicator">Loading...</div>
      ) : error ? (
        <div className="error-message">Error fetching order details: {error}</div>
      ) : order ? (
        <div className="order-info">
          <div className="order-summary">
            <p><strong>Order Amount:</strong> {order.amount || 'N/A'}</p>
            {order.items && order.items.length > 0 ? (
  order.items.map((item, index) => (
    <p key={index}><strong>Quantity:</strong> {item.quantity || 'N/A'}</p>
  ))
) : (
  <p>No items in order</p>
)}
            <p><strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}</p>
            <p><strong>Payment Status:</strong> {order.payment ? 'Paid' : 'Not Paid'}</p>
          </div>

          <h4>Address Details:</h4>
          <div className="address-details">
            <p><strong>First Name:</strong> {order.address.firstName || 'N/A'}</p>
            <p><strong>Last Name:</strong> {order.address.lastName || 'N/A'}</p>
            <p><strong>Email:</strong> {order.address.email || 'N/A'}</p>
            <p><strong>Street:</strong> {order.address.street || 'N/A'}</p>
            <p><strong>City:</strong> {order.address.city || 'N/A'}</p>
            <p><strong>State:</strong> {order.address.state || 'N/A'}</p>
            <p><strong>Zipcode:</strong> {order.address.zipcode || 'N/A'}</p>
            <p><strong>Country:</strong> {order.address.country || 'N/A'}</p>
            <p><strong>Phone:</strong> {order.address.phone || 'N/A'}</p>
          </div>
        </div>
      ) : (
        <div className="no-data">No data available.</div>
      )}

      <div className="links-container">
        <a href="terms-and-conditions.html" target="_blank" rel="noopener noreferrer" className="link">Terms and Conditions</a>
        <span> and </span>
        <a href="data-privacy-policy.html" target="_blank" rel="noopener noreferrer" className="link">Data Privacy Policy</a>
      </div>
    </div>
  );
};

export default OrderDetails;
