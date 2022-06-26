import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import CountPage from './pages/CountPage';
import SentimentPage from './pages/SentimentPage';
import HomePage from './pages/HomePage';

import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function App() {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">APSEI: Twitter Trends</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/count">Count Tweets</Nav.Link>
              <Nav.Link href="/sentiment">Sentiment Analysis</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/count" element={<CountPage />}></Route>
          <Route path="/sentiment" element={<SentimentPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
