import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Record from "./pages/record";  // Importing Record component
import Navbar from "./components/Navbar";  // Importing Navbar
import Dashboard from "./pages/DashBoard";  // Importing Dashboard
import Order from "./components/order";  // Importing Order
import Seller from "./pages/SellerDetails";  // Importing SellerDetails
import Investor from "./pages/InvestorDetails";  // Importing InvestorDetails
import SellerDetails from './pages/SellerDetails';
import UserDetailsModal from './components/UserDetailsModal';  // Importing UserDetailsModal
import ASellerDetails from './pages/ASellerDetails';
import Orderdetails from './pages/orderdetails';
import Logistics from './pages/Logistics';  // Corrected import
import Courier from './pages/Courier';  // Corrected import
import CourierPanel from './Courier/Courierpanel';  // Corrected import
import Complete from './pages/complete';  // Importing Complete

const App = () => {
  const [courierId, setCourierId] = useState(null); // Define courierId state

  return (
    <Router>
      <Navbar />  {/* Your Navbar component */}
      <Container>
        <Row>
          <Col>
            <Routes>
              {/* Home route for Record component */}
              <Route path="/record" element={<Record />} />
              <Route path="/DashBoard" element={<Dashboard />} />
              <Route path="/order" element={<Order />} />
              <Route path="/SellerDetails" element={<Seller />} />
              <Route path="/InvestorDetails" element={<Investor />} />
              <Route path="/SellerDetails/:id" element={<SellerDetails />} />  {/* Update this route */}
              <Route path="/UserDetailsModal/:id" element={<UserDetailsModal />} />  {/* Update this route */}
              <Route path="/ASellerDetails/:id" element={<ASellerDetails />} />  {/* Update this route */}
              <Route path="/orderdetails/:id" element={<Orderdetails />} />
              <Route path="/logistics" element={<Logistics />} />  {/* Corrected route */}
              <Route path="/" element={<Order />} />  {/* Corrected route */}
              <Route path="/Courier" element={<Courier />} />  {/* Corrected route */}
              <Route path="/Courierpanel" element={<CourierPanel courierId={courierId} />} />  {/* Corrected route */}
              <Route path="/complete" element={<Complete />} />  {/* Route for Complete component */}
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
};

export default App;