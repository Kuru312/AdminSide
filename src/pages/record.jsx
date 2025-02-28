import React, { useState, useEffect } from "react";
import './record.css';
import { Link } from 'react-router-dom';  // Import Link for navigation

const AccountRecords = () => {
  const [approveSellerInvestors, setApproveSellerInvestors] = useState([]);  // State to store the approved users data
  const [filteredApproveSellerInvestors, setFilteredApproveSellerInvestors] = useState([]); // State to store filtered approved users
  const [searchTerm, setSearchTerm] = useState(''); // State to store the search term
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    // Fetch data from the backend directly using the full URL
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/approveSellerInvestor'); // Use the full URL
        const data = await response.json();    // Parse the JSON response
        setApproveSellerInvestors(data);  // Store fetched data in 'approveSellerInvestors'
        setFilteredApproveSellerInvestors(data); // Initialize filtered approved users with all approved users
        setLoading(false); // Set loading to false
      } catch (error) {
        console.error("Error fetching approved users:", error);  // Handle errors
        setError(error.message);
        setLoading(false); // Set loading to false
      }
    };

    fetchData();  // Call fetchData when the component mounts
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term) {
      const filtered = approveSellerInvestors.filter(user => 
        user.role.includes(term.toLowerCase())
      );
      setFilteredApproveSellerInvestors(filtered);
    } else {
      setFilteredApproveSellerInvestors(approveSellerInvestors);
    }
  };

  return (
    <main>
      {/* Search Bar */}
      <div className="search-bar">
        <input 
          type="text" 
          id="search" 
          placeholder="Search by account type..." 
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Account Record Categories */}
      <div className="account-categories">
        <div className="category">
          <h3>Sellers</h3>
        </div>
        <div className="category">
          <h3>Investors</h3>
        </div>
      </div>

      {/* Records Table */}
      <div className="record-table">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching approved users: {error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Seller Name</th>
                <th>Email</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {filteredApproveSellerInvestors.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Link to={`/ASellerDetails/${user._id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="record-table">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching approved users: {error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Investor Name</th>
                <th>Email</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {filteredApproveSellerInvestors.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Link to={`/ASellerDetails/${user._id}`} className="btn btn-primary">View Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
};

export default AccountRecords;