import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserDetailsModal = () => {
  const { id } = useParams(); // Extract id from URL parameters
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5001/users/${id}`);
        if (response.status === 404) {
          throw new Error('User not found');
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error);
      }
    };

    fetchUser();
  }, [id]); // Use id as the dependency

  if (error) {
    return <div>Error fetching user details: {error.message}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div id="documentModal" className="modal">
      <div className="modal-content">
        <h3>User Details</h3>
        <p><strong>Name:</strong> {user.name || 'N/A'}</p>
        <p><strong>Email:</strong> {user.email || 'N/A'}</p>
        <p><strong>Business Name:</strong> {user.sellerApplication?.businessName || 'N/A'}</p>
        <p><strong>Company Type:</strong> {user.sellerApplication?.companyType || 'N/A'}</p>
        <p><strong>Province:</strong> {user.sellerApplication?.province || 'N/A'}</p>
        <p><strong>City:</strong> {user.sellerApplication?.city || 'N/A'}</p>
        <p><strong>Farm Location:</strong> {user.sellerApplication?.farmLocation || 'N/A'}</p>
        <p><strong>Contact Number:</strong> {user.sellerApplication?.contactNumber || 'N/A'}</p>
        <p><strong>Supporting Document:</strong> <a href={user.sellerApplication?.supportingDocument} target="_blank" rel="noopener noreferrer">View Document</a></p>
      </div>
    </div>
  );
};

export default UserDetailsModal;