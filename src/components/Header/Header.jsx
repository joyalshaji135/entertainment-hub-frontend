import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check login status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuthStatus();
    
    // Listen for storage events (for login/logout from other tabs)
    window.addEventListener('storage', checkAuthStatus);
    
    // Listen for custom auth events
    window.addEventListener('authChange', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authChange', checkAuthStatus);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // Navigation items for logged-in users
  const loggedInNavItems = [
    { path: '/home', label: 'Movies', icon: '🎬' },
    { path: '/series', label: 'Series', icon: '📺' },
    { path: '/music', label: 'Music', icon: '🎵' },
    { path: '/games', label: 'Games', icon: '🎮' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  // Navigation items for logged-out users
  const loggedOutNavItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/pricing', label: 'Pricing', icon: '💰' },
    { path: '/contact', label: 'Contact', icon: '📞' },
  ];

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Update state
    setIsLoggedIn(false);
    setUser(null);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new Event('authChange'));
    
    // Navigate to home
    navigate('/');
    
    // Show logout message
    alert('You have been logged out successfully!');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  // Get current navigation items based on login status
  const navItems = isLoggedIn ? loggedInNavItems : loggedOutNavItems;

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo - Always visible */}
        <Link to={isLoggedIn ? "/home" : "/"} className="header-logo">
          <div className="logo-animation">
            <span className="logo-icon">🎬</span>
            <span className="logo-text">EntertainHub</span>
          </div>
        </Link>

        {/* Search Bar - Only for logged-in users */}
        {isLoggedIn && (
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
        </nav>

        {/* User Actions - Different based on login status */}
        <div className="header-actions">
          {isLoggedIn ? (
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
                    <img src={user.avatar} alt={user.name} className="user-avatar-img" />
                  ) : (
                    <span className="user-avatar">👤</span>
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