import React, { useState, useEffect } from "react";
import './record.css';
import { Link } from 'react-router-dom';  // Import Link for navigation

const AccountRecords = () => {
  const [users, setUsers] = useState([]);  // State to store all users data
  const [searchTerm, setSearchTerm] = useState(''); // State to store the search term
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users data
        const response = await fetch('http://localhost:5001/users'); // API endpoint for all users
        const data = await response.json();
        setUsers(data); // Set users data
        setLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.error("Error fetching users:", error);  // Handle errors
        setError(error.message);
        setLoading(false); // Set loading to false if there's an error
      }
    };

    fetchData();  // Call fetchData when the component mounts
  }, []);

  // Handle search input change for filtering users
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter users based on the search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main>
      {/* Search Bar */}
      <div className="search-bar">
        <input 
          type="text" 
          id="search" 
          placeholder="Search by name or email..." 
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* User Table Section */}
      <div className="record-table">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching users: {error}</p>
        ) : (
          <>
            <h3>Users</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Roles</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.sellerApplication ? 'Seller' : 'Buyer'}</td>
                      {/* <td>
                        <Link to={`/UserDetails/${user._id}`} className="btn btn-primary">
                          View Details
                        </Link>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4">No users found</td></tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </main>
  );
};

export default AccountRecords;