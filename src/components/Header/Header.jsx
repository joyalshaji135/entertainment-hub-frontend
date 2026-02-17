// components/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleRegister = () => {
    navigate('/register');
    setIsMenuOpen(false);
  };

  // Navigation items for logged-in users
  const loggedInNavItems = [
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/series', label: 'Series', icon: '📺' },
    { path: '/music', label: 'Music', icon: '🎵' },
    { path: '/anime', label: 'Anime', icon: '🍥' },
    { path: '/wishlist', label: 'Wishlist', icon: '❤️' },
  ];

  // Navigation items for logged-out users
  const loggedOutNavItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/pricing', label: 'Pricing', icon: '💰' },
    { path: '/contact', label: 'Contact', icon: '📞' },
  ];

  // Get current navigation items based on login status
  const navItems = isAuthenticated ? loggedInNavItems : loggedOutNavItems;

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo - Always visible */}
        <Link to={isAuthenticated ? "/home" : "/"} className="header-logo">
          <div className="logo-animation">
            <span className="logo-icon">🎬</span>
            <span className="logo-text">EntertainHub</span>
          </div>
        </Link>

        {/* Search Bar - Only for logged-in users */}
        {isAuthenticated && (
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search movies, series, music..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                🔍
              </button>
            </form>
          </div>
        )}

        {/* Navigation - Different items based on login status */}
        <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-item ${
                location.pathname === link.path ? 'active' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
            </Link>
          ))}
          
          {/* Show profile link in mobile menu for logged-in users */}
          {isAuthenticated && (
            <Link
              to="/profile"
              className={`nav-item ${
                location.pathname === '/profile' ? 'active' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-label">Profile</span>
            </Link>
          )}
          
          {/* Show auth buttons in mobile menu for logged-out users */}
          {!isAuthenticated && (
            <div className="mobile-auth-buttons">
              <button className="nav-item auth-btn login-btn" onClick={handleLogin}>
                <span className="nav-icon">🔑</span>
                <span className="nav-label">Login</span>
              </button>
              <button className="nav-item auth-btn register-btn" onClick={handleRegister}>
                <span className="nav-icon">📝</span>
                <span className="nav-label">Register</span>
              </button>
            </div>
          )}
        </nav>

        {/* User Actions - Different based on login status */}
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              {/* Notification Bell for logged-in users */}
              <button className="notification-btn">
                <span className="notification-icon">🔔</span>
                <span className="notification-badge">3</span>
              </button>
              
              {/* User Dropdown for logged-in users */}
              <div className="user-dropdown">
                <button className="user-btn">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name || 'User'} 
                      className="user-avatar-img" 
                    />
                  ) : (
                    <span className="user-avatar">
                      {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
                    </span>
                  )}
                </button>
                <div className="dropdown-menu">
                  <div className="user-info">
                    <div className="user-name">{user?.name || 'User'}</div>
                    <div className="user-email">{user?.email || 'user@example.com'}</div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                    <span className="dropdown-icon">👤</span>
                    Profile
                  </Link>
                  <Link to="/watchlist" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                    <span className="dropdown-icon">❤️</span>
                    Watchlist
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                    <span className="dropdown-icon">⚙️</span>
                    Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <span className="dropdown-icon">🚪</span>
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Login/Register buttons for logged-out users */
            <div className="auth-buttons">
              <button className="auth-btn login-btn" onClick={handleLogin}>
                Login
              </button>
              <button className="auth-btn register-btn" onClick={handleRegister}>
                Register
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;