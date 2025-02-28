import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap'; // Importing Button from Bootstrap
import { Link } from 'react-router-dom';  // Import Link for navigation
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS
import './application.css';

const Dashboard = () => {
  const [sellers, setSellers] = useState([]);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);  // State to store the users data

  useEffect(() => {
    // Fetch data from the backend directly using the full URL
    const fetchData = async () => {
      try {
        // Change the fetch URL to the full backend URL
        const response = await fetch('http://localhost:5001/users'); // Use the full URL
        const data = await response.json();    // Parse the JSON response
        setUsers(data);  // Store fetched data in 'users'
      } catch (error) {
        console.error("Error fetching users:", error);  // Handle errors
      }
    };

    fetchData();  // Call fetchData when the component mounts
  }, []);

  const handleApprove = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5001/approve/${userId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to approve user');
      }
      // Optionally, update the UI or refetch the users list
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User approved successfully!');
    } catch (error) {
      console.error("Error approving user:", error);
      setError(error.message);
      toast.error('Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5001/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      // Optionally, update the UI or refetch the users list
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User rejected successfully!');
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(error.message);
      toast.error('Failed to reject user');
    }
  };

  return (
    <main className="container-fluid bg-light p-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center bg-white p-4 shadow rounded mb-5">
        <div className="left">
          <h1 className="text-primary">Dashboard</h1>
        </div>
      </div>

      {/* Application for Seller Table Section */}
      <div className="table-responsive mt-5">
        <div className="d-flex justify-content-between mb-3">
          <h3>Application for Seller</h3>
          <div>
            <i className="bx bx-search text-muted mr-3" style={{ fontSize: '1.5rem' }}></i>
            <i className="bx bx-filter text-muted" style={{ fontSize: '1.5rem' }}></i>
          </div>
        </div>
        {error ? (
          <p>Error fetching applications: {error}</p>
        ) : (
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Business Name</th>
                <th>Check</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.sellerApplication?.businessName || 'N/A'}</td>
                  <td>
                    <Link to={`/SellerDetails/${user._id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </td>
                  {/* Add Approve and Reject Buttons */}
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => handleApprove(user._id)} // Approve action handler
                    >
                      Approve
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleReject(user._id)} // Reject action handler
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Application for Seller Table Section */}
      <div className="table-responsive mt-5">
        <div className="d-flex justify-content-between mb-3">
          <h3>Application for Investor</h3>
          <div>
            <i className="bx bx-search text-muted mr-3" style={{ fontSize: '1.5rem' }}></i>
            <i className="bx bx-filter text-muted" style={{ fontSize: '1.5rem' }}></i>
          </div>
        </div>
        {error ? (
          <p>Error fetching applications: {error}</p>
        ) : (
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Check</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        )}
      </div>
      <ToastContainer /> {/* Add ToastContainer to render toast notifications */}
    </main>
  );
};

export default Dashboard;