import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock authentication - In real app, this would be an API call
    const mockUsers = [
      { email: 'user@example.com', password: 'password123', name: 'John Doe', avatar: null },
      { email: 'admin@entertainhub.com', password: 'admin123', name: 'Admin User', avatar: null },
    ];

    const user = mockUsers.find(
      u => u.email === formData.email && u.password === formData.password
    );

    if (user) {
      // Simulate successful login
      const userData = {
        id: Date.now(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token: 'mock-jwt-token-' + Date.now(),
        isPremium: Math.random() > 0.5 // Random premium status for demo
      };

      // Save to localStorage
      localStorage.setItem('authToken', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Dispatch auth change event
      window.dispatchEvent(new Event('authChange'));

      // Show success message
      alert('Login successful! Welcome back to EntertainHub.');

      // Navigate to home
      navigate('/home');
    } else {
      setError('Invalid email or password. Please try again.');
    }

    setLoading(false);
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'user@example.com',
      password: 'password123',
      rememberMe: false
    });
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card slide-in-left">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back!</h2>
          <p className="auth-subtitle">Sign in to continue your entertainment journey</p>
        </div>

        {error && (
          <div className="error-message-box">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-group">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <span className="btn-text">Sign In</span>
                <span className="btn-arrow">→</span>
              </>
            )}
          </button>

          <div className="demo-login">
            <button 
              type="button" 
              className="demo-btn"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              Try Demo Account
            </button>
          </div>

          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          <div className="social-auth">
            <button type="button" className="social-btn google" disabled={loading}>
              <span className="social-icon">G</span>
              Google
            </button>
            <button type="button" className="social-btn facebook" disabled={loading}>
              <span className="social-icon">f</span>
              Facebook
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Sign up now
              </Link>
            </p>
          </div>
        </form>
      </div>

      <div className="auth-decoration slide-in-right">
        <div className="decoration-item float" style={{ animationDelay: '0s' }}>
          <span className="decoration-icon">🎬</span>
        </div>
        <div className="decoration-item float" style={{ animationDelay: '0.3s' }}>
          <span className="decoration-icon">🎵</span>
        </div>
        <div className="decoration-item float" style={{ animationDelay: '0.6s' }}>
          <span className="decoration-icon">🎮</span>
        </div>
        <div className="decoration-text">
          <h3>Unlock Premium Features</h3>
          <p>Access exclusive content and personalized recommendations</p>
        </div>
      </div>
    </div>
  );
};

export default Login;