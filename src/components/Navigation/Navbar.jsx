import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar fade-in">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">EntertainHub</span>
        </Link>

        <div className="nav-buttons">
          <Link to="/login" className="btn-login">Login</Link>
          <Link to="/register" className="btn-register">Register</Link>
          
          <button 
            className="menu-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`bar ${isMenuOpen ? 'change' : ''}`}></span>
            <span className={`bar ${isMenuOpen ? 'change' : ''}`}></span>
            <span className={`bar ${isMenuOpen ? 'change' : ''}`}></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;