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

  useEffect(() => {
    // Fetch couriers from the backend
    const fetchCouriers = async () => {
      try {
        const response = await fetch('http://localhost:5001/couriers');
        const data = await response.json();
        setCouriers(data);
      } catch (error) {
        console.error("Error fetching couriers:", error);
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
      console.error("Error adding courier:", error);
      toast.error('Error adding courier.');
    }
  };

  return (
    <main className="container mt-5">
      {/* Header Section */}
      <div className="header d-flex justify-content-between align-items-center mb-4">
        <h2 className="font-weight-bold text-primary">Courier Management</h2>
      </div>

      {/* Add Courier Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="card-title">Add New Courier</h4>
          <form onSubmit={(e) => { e.preventDefault(); addCourier(); }}>
            <div className="form-row">
              <div className="form-group col-md-6">
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
              <div className="form-group col-md-6">
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

            <div className="form-row">
              <div className="form-group col-md-6">
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
              <div className="form-group col-md-6">
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

      {/* Courier Table Section */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-3">Courier List</h4>
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Plate Number</th>
                <th>Driver License</th>
              </tr>
            </thead>
            <tbody>
              {couriers.map((courier) => (
                <tr key={courier._id}>
                  <td>{courier.name}</td>
                  <td>{courier.address}</td>
                  <td>{courier.plate_number}</td>
                  <td>{courier.driver_license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer /> {/* Add ToastContainer to render toast notifications */}
    </main>
  );
};

export default Couriers;
