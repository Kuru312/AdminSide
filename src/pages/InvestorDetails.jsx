import React from 'react';
import './application.css'; // Make sure to import the CSS file

const InvestorDetails = () => {
  return (
    <div className="investor-container">
      <h3 className="investor-heading">Investor Details</h3>
      <div className="investor-info">
        <p><strong>Name:</strong> Jane Smith</p>
        <p><strong>Email:</strong> jane.smith@example.com</p>
        <p><strong>Phone:</strong> 123-456-7890</p>
      </div>
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
