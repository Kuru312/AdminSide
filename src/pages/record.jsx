import React, { useState, useEffect } from "react";
import './record.css';
import { Link } from 'react-router-dom';  // Import Link for navigation

const AccountRecords = () => {
  const [approveSellerInvestors, setApproveSellerInvestors] = useState([]);  // State to store the approved users data
  const [filteredSellers, setFilteredSellers] = useState([]); // State to store filtered sellers
  const [filteredInvestors, setFilteredInvestors] = useState([]); // State to store filtered investors
  const [filteredBuyers, setFilteredBuyers] = useState([]); // State to store filtered buyers
  const [searchTerm, setSearchTerm] = useState(''); // State to store the search term
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for approved sellers and investors
        const responseSellerInvestor = await fetch('http://localhost:5001/approveSellerInvestor'); // API endpoint for sellers/investors
        const sellerInvestorData = await responseSellerInvestor.json();
        setApproveSellerInvestors(sellerInvestorData); 
        
        // Separate sellers and investors based on application type
        const sellers = sellerInvestorData.filter(user => user.sellerApplication !== null);
        const investors = sellerInvestorData.filter(user => user.investorApplication !== null);
        
        setFilteredSellers(sellers); // Set sellers data
        setFilteredInvestors(investors); // Set investors data

        // Fetch users data for buyers
        const responseUsers = await fetch('http://localhost:5001/users'); // API endpoint for all users
        const usersData = await responseUsers.json();

        // Merge data from buyer-related data and users
        const mergedBuyers = [...usersData];

        setFilteredBuyers(mergedBuyers); // Set initial state for filtered buyers
        
        setLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.error("Error fetching approved users:", error);  // Handle errors
        setError(error.message);
        setLoading(false); // Set loading to false if there's an error
      }
    };

    fetchData();  // Call fetchData when the component mounts
  }, []);

  // Handle search input change for filtering users
  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term) {
      // Filter sellers and investors by the search term
      const filteredSellersList = approveSellerInvestors.filter(user =>
        user.sellerApplication !== null &&
        (user.name.toLowerCase().includes(term.toLowerCase()) || user.email.toLowerCase().includes(term.toLowerCase()))
      );
      setFilteredSellers(filteredSellersList);

      const filteredInvestorsList = approveSellerInvestors.filter(user =>
        user.investorApplication !== null &&
        (user.name.toLowerCase().includes(term.toLowerCase()) || user.email.toLowerCase().includes(term.toLowerCase()))
      );
      setFilteredInvestors(filteredInvestorsList);

      // Filter buyers
      const filteredBuyersList = filteredBuyers.filter(buyer => 
        buyer.name.toLowerCase().includes(term.toLowerCase()) || 
        buyer.email.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredBuyers(filteredBuyersList);
    } else {
      setFilteredSellers(approveSellerInvestors.filter(user => user.sellerApplication !== null));
      setFilteredInvestors(approveSellerInvestors.filter(user => user.investorApplication !== null));
      setFilteredBuyers(filteredBuyers);
    }
  };

  return (
    <main>
      {/* Search Bar */}
      <div className="search-bar">
        <input 
          type="text" 
          id="search" 
          placeholder="Search by name or role..." 
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Records Table for Sellers */}
      <div className="record-table">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching approved users: {error}</p>
        ) : (
          <>
            <h3>Sellers</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {filteredSellers.map(user => (
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
          </>
        )}
      </div>

      {/* Records Table for Investors */}
      <div className="record-table">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching approved users: {error}</p>
        ) : (
          <>
            <h3>Investors</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvestors.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Link to={`/AInvestorDetails/${user._id}`} className="btn btn-primary">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Records Table for Buyers */}
      <div className="record-table">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching approved users: {error}</p>
        ) : (
          <>
            <h3>Buyers</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuyers.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

    </main>
  );
};

export default AccountRecords;
