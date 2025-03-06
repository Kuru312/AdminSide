import './application.css'; // Make sure you have the right CSS file imported
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SellerDetails = () => {
  const { id } = useParams(); // Get the seller ID from the URL parameters
  const [investorDetails, setInvestorDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/approveSellerInvestor/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Seller not found');
          } else {
            throw new Error('Network response was not ok');
          }
        }
        const data = await response.json();
        setInvestorDetails(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchSellerDetails();
  }, [id]);

  return (
    <div className="investor-container">
      <h3 className="investor-heading">Investor Details</h3>
      {isLoading ? (
        <div className="loading-indicator">
          <span>Loading...</span> {/* You can replace this with a spinner */}
        </div>
      ) : error ? (
        <p>Error fetching investor details: {error}</p>
      ) : investorDetails ? (
        <div className="investor-info">
          <p><strong>Investment Type:</strong> {investorDetails.investorApplication?.investmentType || 'N/A'}</p>
          <p><strong>Company Name:</strong> {investorDetails.investorApplication?.companyName || 'N/A'}</p>
          <p><strong>Industry:</strong> {investorDetails.investorApplication?.industry || 'N/A'}</p>
          <p><strong>Contact Number:</strong> {investorDetails.investorApplication?.contactNumber || 'N/A'}</p>
          <p><strong>Investment Amount:</strong> ${investorDetails.investorApplication?.investmentAmount || 'N/A'}</p>
          <p><strong>Supporting Document:</strong> <a href={investorDetails.investorApplication?.supportingDocument} target="_blank" rel="noopener noreferrer">View Document</a></p>
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
