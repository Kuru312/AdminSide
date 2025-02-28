import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function CollapsibleExample() {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/DashBoard">E-FARMING</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link as={Link} to="/DashBoard">Dashboard</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/complete">Delivery</Nav.Link>
            <Nav.Link as={Link} to="/courier">Courier</Nav.Link>
            <Nav.Link as={Link} to="/logistics">Logistics</Nav.Link>
            <Nav.Link as={Link} to="/order">Order Management</Nav.Link>
            <Nav.Link as={Link} to="/record">Approve Account</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CollapsibleExample;
