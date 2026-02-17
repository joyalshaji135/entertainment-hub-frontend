import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && !isSubscribed) {
      setIsSubscribed(true);
      // Simulate API call
      setTimeout(() => {
        alert('Successfully subscribed to newsletter!');
        setEmail('');
      }, 500);
    }
  };

  const quickLinks = {
    'Movies': ['New Releases', 'Popular', 'Top Rated', 'Upcoming'],
    'Series': ['TV Shows', 'Documentaries', 'Reality TV', 'Anime'],
    'Music': ['Top Charts', 'New Albums', 'Playlists', 'Genres'],
    'Games': ['PC Games', 'Console', 'Mobile', 'Indie'],
  };

  const companyLinks = ['About Us', 'Careers', 'Press', 'Blog'];
  const supportLinks = ['Help Center', 'Contact Us', 'FAQ', 'System Status'];
  const legalLinks = ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Copyright'];

  const socialMedia = [
    { icon: '📘', name: 'Facebook', url: 'https://facebook.com' },
    { icon: '🐦', name: 'Twitter', url: 'https://twitter.com' },
    { icon: '📷', name: 'Instagram', url: 'https://instagram.com' },
    { icon: '📺', name: 'YouTube', url: 'https://youtube.com' },
    { icon: '💼', name: 'LinkedIn', url: 'https://linkedin.com' },
  ];

  const downloadApps = [
    { icon: '📱', store: 'App Store', platform: 'iOS' },
    { icon: '🤖', store: 'Play Store', platform: 'Android' },
    { icon: '💻', store: 'Microsoft', platform: 'Windows' },
    { icon: '🍎', store: 'Mac App Store', platform: 'macOS' },
  ];

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="newsletter-content">
          {/* <div className="newsletter-text">
            <h3 className="newsletter-title">Stay Updated</h3>
            <p className="newsletter-description">
              Subscribe to our newsletter for the latest movie releases, exclusive content, and special offers.
            </p>
          </div> */}
          
          {/* <form onSubmit={handleSubscribe} className="newsletter-form">
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="newsletter-input"
                required
                disabled={isSubscribed}
              />
              <button 
                type="submit" 
                className="newsletter-btn"
                disabled={isSubscribed}
              >
                {isSubscribed ? '✅ Subscribed!' : 'Subscribe'}
              </button>
            </div>
            <p className="form-note">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </form> */}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          {/* Company Info */}
          <div className="footer-section">
            <Link to="/" className="footer-logo">
              <span className="logo-icon">🎬</span>
              <span className="logo-text">EntertainHub</span>
            </Link>
            <p className="company-description">
              Your ultimate destination for movies, series, music, and games. 
              Stream unlimited content anytime, anywhere.
            </p>
            <div className="app-downloads">
              <h4>Download Our App</h4>
              <div className="download-buttons">
                {downloadApps.map((app, index) => (
                  <a 
                    key={index}
                    href="#"
                    className="download-btn"
                    aria-label={`Download for ${app.platform}`}
                  >
                    <span className="app-icon">{app.icon}</span>
                    <div className="app-info">
                      <div className="app-platform">{app.platform}</div>
                      <div className="app-store">{app.store}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          {Object.entries(quickLinks).map(([category, links]) => (
            <div key={category} className="footer-section">
              <h4 className="section-title">{category}</h4>
              <ul className="footer-links">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link to={`/${category.toLowerCase()}/${link.toLowerCase().replace(' ', '-')}`}>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Company & Support */}
          <div className="footer-section">
            <h4 className="section-title">Company</h4>
            <ul className="footer-links">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link to={`/company/${link.toLowerCase().replace(' ', '-')}`}>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h4 className="section-title support-title">Support</h4>
            <ul className="footer-links">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link to={`/support/${link.toLowerCase().replace(' ', '-')}`}>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="footer-section">
            <h4 className="section-title">Connect With Us</h4>
            <div className="social-links">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <span className="social-icon">{social.icon}</span>
                </a>
              ))}
            </div>
            
            <div className="contact-info">
              <h4 className="section-title">Contact Info</h4>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>support@entertainhub.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>123 Entertainment St, Hollywood, CA 90210</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="copyright">
            © {new Date().getFullYear()} EntertainHub. All rights reserved.
          </div>
          
          <div className="legal-links">
            {legalLinks.map((link, index) => (
              <React.Fragment key={index}>
                <Link to={`/legal/${link.toLowerCase().replace(' ', '-')}`}>
                  {link}
                </Link>
                {index < legalLinks.length - 1 && <span className="separator">•</span>}
              </React.Fragment>
            ))}
          </div>
          
          <div className="payment-methods">
            <span className="payment-icon">💳</span>
            <span className="payment-icon">💰</span>
            <span className="payment-icon">🏦</span>
            <span className="payment-icon">💎</span>
            <span className="payment-text">Secure Payments</span>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <button 
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        ↑
      </button>
    </footer>
  );
};

export default Footer;