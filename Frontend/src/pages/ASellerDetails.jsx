import './application.css'; // Make sure you have the right CSS file imported
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SellerDetails = () => {
  const { id } = useParams(); // Get the seller ID from the URL parameters
  const [approveSellerInvestor, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const response = await fetch(`https://adminside-lo8s.onrender.com/approveSellerInvestor/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Seller not found');
          } else {
            throw new Error('Network response was not ok');
          }
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchSellerDetails();
  }, [id]);

  return (
    <div className="seller-container">
      <h3 className="seller-heading">Seller Details</h3>
      {isLoading ? (
        <div className="loading-indicator">
          <span>Loading...</span> {/* Or include a spinner here */}
        </div>
      ) : error ? (
        <p>Error fetching seller details: {error}</p>
      ) : approveSellerInvestor ? (
        <div className="seller-info">
          <p><strong>Business Name:</strong> {approveSellerInvestor.sellerApplication?.businessName || 'N/A'}</p>
          <p><strong>Name:</strong> {approveSellerInvestor.name || 'N/A'}</p>
          <p><strong>Email:</strong> {approveSellerInvestor.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {approveSellerInvestor.sellerApplication?.contactNumber || 'N/A'}</p>
          <p><strong>Location:</strong> {approveSellerInvestor.sellerApplication?.city || 'N/A'}</p>
          <p><strong>Province:</strong> {approveSellerInvestor.sellerApplication?.province || 'N/A'}</p>
          <p><strong>Farm Location:</strong> {approveSellerInvestor.sellerApplication?.farmLocation || 'N/A'}</p>
          <p><strong>Supporting Document:</strong> <a href={approveSellerInvestor.sellerApplication?.supportingDocument} target="_blank" rel="noopener noreferrer">View Document</a></p>
        </div>
      ) : (
        <p>No data available.</p>
      )}
      <div className="links-container">
        <a href="terms-and-conditions.html" target="_blank" rel="noopener noreferrer" className="link">
          Terms and Conditions
        </a>
        <span> and </span>
        <a href="data-privacy-policy.html" target="_blank" rel="noopener noreferrer" className="link">
          Data Privacy Policy
        </a>
      </div>
    </div>
  );
};

export default SellerDetails;