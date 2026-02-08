import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    plan: 'basic',
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email address';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock registration
    const userData = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      plan: formData.plan,
      token: 'mock-jwt-token-' + Date.now(),
      isPremium: formData.plan !== 'basic',
      joinDate: new Date().toISOString(),
      watchlist: [],
      favorites: []
    };

    // Save to localStorage
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));

    // Dispatch auth change event
    window.dispatchEvent(new Event('authChange'));

    // Show success message
    alert(`Welcome to EntertainHub, ${userData.name}! Your ${formData.plan} account has been created.`);

    // Navigate to home
    navigate('/home');

    setLoading(false);
  };

  const plans = [
    { id: 'basic', name: 'Basic', price: 'Free', features: ['SD Quality', '1 Device', 'Limited Content'] },
    { id: 'premium', name: 'Premium', price: '$9.99/month', features: ['HD Quality', '4 Devices', 'All Content'] },
    { id: 'family', name: 'Family', price: '$14.99/month', features: ['4K Quality', '6 Devices', 'All Content + Kids'] }
  ];

  return (
    <div className="register-container fade-in">
      <div className="register-card slide-in-left">
        <div className="register-header">
          <h2 className="register-title">Join EntertainHub</h2>
          <p className="register-subtitle">Start your entertainment journey today</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-group">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={errors.name ? 'error' : ''}
                  disabled={loading}
                />
              </div>
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

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
                  className={errors.email ? 'error' : ''}
                  disabled={loading}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
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
                  placeholder="Create a password"
                  className={errors.password ? 'error' : ''}
                  disabled={loading}
                />
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'error' : ''}
                  disabled={loading}
                />
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="plan-selection">
            <h3>Choose Your Plan</h3>
            <div className="plans-grid">
              {plans.map(plan => (
                <div 
                  key={plan.id}
                  className={`plan-card ${formData.plan === plan.id ? 'selected' : ''}`}
                  onClick={() => !loading && handleChange({ target: { name: 'plan', value: plan.id } })}
                >
                  <div className="plan-header">
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      checked={formData.plan === plan.id}
                      onChange={handleChange}
                      className="plan-radio"
                      disabled={loading}
                    />
                    <h4>{plan.name}</h4>
                    <div className="plan-price">{plan.price}</div>
                  </div>
                  <ul className="plan-features">
                    {plan.features.map((feature, index) => (
                      <li key={index}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="terms-section">
            <label className={`checkbox-label ${errors.termsAccepted ? 'error' : ''}`}>
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="checkmark"></span>
              I agree to the{' '}
              <Link to="/terms" className="terms-link">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="terms-link">Privacy Policy</Link>
            </label>
            {errors.termsAccepted && <span className="error-message">{errors.termsAccepted}</span>}
          </div>

          <button 
            type="submit" 
            className="register-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <span className="btn-text">Create Account</span>
                <span className="btn-sparkle">✨</span>
              </>
            )}
          </button>

          <div className="register-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="register-link">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>

      <div className="register-benefits slide-in-right">
        <div className="benefits-header">
          <h3>Why Join EntertainHub?</h3>
          <div className="benefits-star">⭐</div>
        </div>
        
        <div className="benefits-list">
          {[
            { icon: '🎬', text: 'Unlimited movies and shows' },
            { icon: '🎵', text: 'Ad-free music streaming' },
            { icon: '🎮', text: 'Exclusive game content' },
            { icon: '📱', text: 'Watch anywhere, cancel anytime' },
            { icon: '👨‍👩‍👧‍👦', text: 'Create up to 5 profiles' },
            { icon: '🔒', text: 'Secure and private viewing' }
          ].map((benefit, index) => (
            <div key={index} className="benefit-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <span className="benefit-icon">{benefit.icon}</span>
              <span className="benefit-text">{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Register;