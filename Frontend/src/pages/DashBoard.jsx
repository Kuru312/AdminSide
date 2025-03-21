import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap'; // Importing Button from Bootstrap
import { Link } from 'react-router-dom';  // Import Link for navigation
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS
import './application.css';

const Dashboard = () => {
  const [sellers, setSellers] = useState([]);  // Store filtered users with seller applications
  const [investors, setInvestors] = useState([]);  // Store filtered users with investor applications
  const [error, setError] = useState(null);  // Store errors (if any)
  const [users, setUsers] = useState([]);    // Store all users data
  const [activeSection, setActiveSection] = useState('sellers'); // Active section for toggle

  useEffect(() => {
    // Fetch data from the backend directly using the full URL
    const fetchData = async () => {
      try {
        // Fetch data from the backend for both seller and investor applications
        const response = await fetch('https://adminside-lo8s.onrender.com/users');  // Fetch all users data from backend
        const data = await response.json();  // Parse the JSON response

        // Filter users to get only those with non-null sellerApplication or investorApplication
        const filteredUsers = data.filter(user =>
          user.sellerApplication !== null || user.investorApplication !== null
        );

        setUsers(filteredUsers);  // Store the filtered data in 'users'

        // Filter and store sellers with non-null sellerApplication
        const sellerUsers = data.filter(user => user.sellerApplication !== null);
        setSellers(sellerUsers);  // Store only seller users with valid applications

        // Filter and store investors with non-null investorApplication
        const investorUsers = data.filter(user => user.investorApplication !== null);
        setInvestors(investorUsers);  // Store only investor users with valid applications

      } catch (error) {
        setError("Error fetching users: " + error.message);  // Handle any fetch errors
        console.error("Error fetching users:", error);
      }
    };

    fetchData();  // Call fetchData when the component mounts
  }, []);  // Empty dependency array ensures this only runs once

  const handleApprove = async (userId) => {
    try {
      const response = await fetch(`https://adminside-lo8s.onrender.com/approve/${userId}`, {
        method: 'POST',
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to approve user: ${errorDetails}`);
      }
  
      // After approval, remove the user from the UI and show a success message
      setUsers(users.filter(user => user._id !== userId));
      setSellers(sellers.filter(user => user._id !== userId));
      setInvestors(investors.filter(user => user._id !== userId));
      
      toast.success('User approved and moved to approved list!');
    } catch (error) {
      console.error("Error approving user:", error);
      setError(error.message);
      toast.error('Failed to approve user');
    }
  };
  
  const handleReject = async (userId) => {
    try {
      const response = await fetch(`https://adminside-lo8s.onrender.com/users/${userId}`, {
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

      {/* Toggle Buttons for Sellers and Investors */}
      <div className="d-flex justify-content-center mb-4">
        {/* <button
          className={`btn ${activeSection === 'investors' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveSection('investors')}
        >
          Investor Applications
        </button> */}
      </div>

      {/* Application for Seller Table Section */}
      {activeSection === 'sellers' && (
        <div className="table-responsive mt-5">
          <div className="d-flex justify-content-between mb-3">
            <h3>View Sellers</h3>
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
                </tr>
              </thead>
              <tbody>
                {sellers.map(user => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.sellerApplication?.businessName || 'N/A'}</td>
                    <td>
                      <Link to={`/SellerDetails/${user._id}`} className="btn btn-primary">
                        View Details
                      </Link>
                    </td>
                    {/* <td>
                      <button
                        className="btn btn-success"
                        onClick={() => handleApprove(user._id)} // Approve action handler
                      >
                        Approve
                      </button>
                    </td> */}
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
      )}

      {/* Application for Investor Table Section */}
      {/* {activeSection === 'investors' && (
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
                {investors.map(user => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>
                      <Link to={`/InvestorDetails/${user._id}`} className="btn btn-primary">
                        View Details
                      </Link>
                    </td>
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
      )} */}

      <ToastContainer /> {/* Add ToastContainer to render toast notifications */}
    </main>
  );
};

export default Dashboard;
