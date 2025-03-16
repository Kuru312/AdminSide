import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/order.css'; // Reuse the same CSS file as Order.jsx
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Couriers = () => {
  const [couriers, setCouriers] = useState([]);
  const [newCourier, setNewCourier] = useState({
    name: '',
    available: true,
    address: '',
    plate_number: '',
    driver_license: ''
  });

  const [activeSection, setActiveSection] = useState('addCourier'); // Active section for toggle

  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        const response = await fetch('http://localhost:5001/couriers');
        const data = await response.json();
        setCouriers(data);
      } catch (error) {
        console.error('Error fetching couriers:', error);
      }
    };

    fetchCouriers();
  }, []);

  const addCourier = async () => {
    try {
      const response = await fetch('http://localhost:5001/couriers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourier),
      });

      if (response.ok) {
        const addedCourier = await response.json();
        setCouriers([...couriers, addedCourier]);
        toast.success('Courier added successfully!');
        setNewCourier({
          name: '',
          available: true,
          address: '',
          plate_number: '',
          driver_license: ''
        });
      } else {
        toast.error('Failed to add courier.');
      }
    } catch (error) {
      console.error('Error adding courier:', error);
      toast.error('Error adding courier.');
    }
  };

  const removeCourier = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/couriers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCouriers(couriers.filter(courier => courier._id !== id));
        toast.success('Courier removed successfully!');
      } else {
        toast.error('Failed to remove courier.');
      }
    } catch (error) {
      console.error('Error removing courier:', error);
      toast.error('Error removing courier.');
    }
  };

  return (
    <main className="container mt-5">
      {/* Header Section */}
      <div className="row justify-content-between mb-4">
        <div className="col-12">
          <h2 className="font-weight-bold text-primary">Courier Management</h2>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="toggle-buttons mb-4 text-center">
        <button
          onClick={() => setActiveSection('addCourier')}
          className={`btn ${activeSection === 'addCourier' ? 'active' : ''}`}
        >
          Add Courier
        </button>
        <button
          onClick={() => setActiveSection('courierList')}
          className={`btn ${activeSection === 'courierList' ? 'active' : ''}`}
        >
          Courier List
        </button>
      </div>

      {/* Add Courier Section */}
      {activeSection === 'addCourier' && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h4 className="card-title mb-4">Add New Courier</h4>
            <form onSubmit={(e) => { e.preventDefault(); addCourier(); }}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="courierName">Name</label>
                  <input
                    type="text"
                    id="courierName"
                    className="form-control"
                    value={newCourier.name}
                    onChange={(e) => setNewCourier({ ...newCourier, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="courierAddress">Address</label>
                  <input
                    type="text"
                    id="courierAddress"
                    className="form-control"
                    value={newCourier.address}
                    onChange={(e) => setNewCourier({ ...newCourier, address: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="courierPlateNumber">Plate Number</label>
                  <input
                    type="text"
                    id="courierPlateNumber"
                    className="form-control"
                    value={newCourier.plate_number}
                    onChange={(e) => setNewCourier({ ...newCourier, plate_number: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="courierDriverLicense">Driver License</label>
                  <input
                    type="text"
                    id="courierDriverLicense"
                    className="form-control"
                    value={newCourier.driver_license}
                    onChange={(e) => setNewCourier({ ...newCourier, driver_license: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-primary btn-lg">Add Courier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courier List Section */}
      {activeSection === 'courierList' && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h4 className="card-title mb-4">Courier List</h4>
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Plate Number</th>
                  <th>Driver License</th>
                  <th>Actions</th> {/* Added Actions column */}
                </tr>
              </thead>
              <tbody>
                {couriers.map((courier) => (
                  <tr key={courier._id}>
                    <td>{courier._id}</td>
                    <td>{courier.name}</td>
                    <td>{courier.address}</td>
                    <td>{courier.plate_number}</td>
                    <td>{courier.driver_license}</td>
                    <td>
                      {/* Remove Courier Button */}
                      <button
                        className="btn btn-danger"
                        onClick={() => removeCourier(courier._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ToastContainer /> {/* Add ToastContainer to render toast notifications */}
    </main>
  );
};

export default Couriers;
