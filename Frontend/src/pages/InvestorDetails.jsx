import './application.css'; // Make sure you have the right CSS file imported
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const InvestorDetails = () => {
  const { id } = useParams(); // Get the investor ID from the URL parameters
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchInvestorDetails = async () => {
      try {
        const response = await fetch(`https://adminside-lo8s.onrender.com/users/${id}`);  // Fetch user details based on ID
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Investor not found');
          } else {
            throw new Error('Network response was not ok');
          }
        }
        const data = await response.json();
        setUser(data);  // Set the fetched data in the state
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchInvestorDetails();
  }, [id]);  // Fetch data again if the `id` parameter changes

  return (
    <div className="investor-container">
      <h3 className="investor-heading">Investor Details</h3>
      {isLoading ? (
        <div className="loading-indicator">
          <span>Loading...</span> {/* You can replace this with a spinner */}
        </div>
      ) : error ? (
        <p>Error fetching investor details: {error}</p>
      ) : user ? (
        <div className="investor-info">
          <p><strong>Investment Type:</strong> {user.investorApplication?.investmentType || 'N/A'}</p>
          <p><strong>Company Name:</strong> {user.investorApplication?.companyName || 'N/A'}</p>
          <p><strong>Industry:</strong> {user.investorApplication?.industry || 'N/A'}</p>
          <p><strong>Contact Number:</strong> {user.investorApplication?.contactNumber || 'N/A'}</p>
          <p><strong>Investment Amount:</strong> ${user.investorApplication?.investmentAmount || 'N/A'}</p>
          <p><strong>Supporting Document:</strong> <a href={user.investorApplication?.supportingDocument} target="_blank" rel="noopener noreferrer">View Document</a></p>
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

export default InvestorDetails;
