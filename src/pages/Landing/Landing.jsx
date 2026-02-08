import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  useEffect(() => {
    // Add animation class to elements
    const elements = document.querySelectorAll('.feature-card, .movie-card, .trending-item');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content slide-in-left">
          <h1 className="hero-title">
            Unlimited <span className="highlight">Entertainment</span> <br />
            Anytime, Anywhere
          </h1>
          <p className="hero-subtitle">
            Stream thousands of movies, TV shows, music, and games all in one place. 
            Experience entertainment like never before.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-hero btn-primary">
              Start Free Trial
              <span className="btn-icon">🎬</span>
            </Link>
            <Link to="/login" className="btn-hero btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-image slide-in-right">
          <div className="floating-cards">
            <div className="card card-1 float" style={{ animationDelay: '0s' }}>🎬</div>
            <div className="card card-2 float" style={{ animationDelay: '0.5s' }}>🎮</div>
            <div className="card card-3 float" style={{ animationDelay: '1s' }}>🎵</div>
            <div className="card card-4 float" style={{ animationDelay: '1.5s' }}>📺</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title fade-in">Why Choose EntertainHub?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌟</div>
            <h3>Premium Content</h3>
            <p>Access exclusive movies, shows, and music not available anywhere else</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>4K streaming with zero buffering and instant downloads</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Multi-Device</h3>
            <p>Watch on your phone, tablet, laptop, or TV simultaneously</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Safe & Secure</h3>
            <p>Your data is protected with enterprise-grade security</p>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="trending-section">
        <h2 className="section-title fade-in">Trending Now</h2>
        <div className="trending-grid">
          {['Action Movies', 'Sci-Fi Series', 'Pop Music', 'Racing Games', 'Comedy Shows', 'Anime'].map((item, index) => (
            <div key={index} className="trending-item pulse" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="trending-icon">
                {['🎯', '🚀', '🎵', '🏎️', '😂', '🇯🇵'][index]}
              </div>
              <h4>{item}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section gradient-bg">
        <div className="cta-content fade-in">
          <h2>Ready to Dive In?</h2>
          <p>Join millions of users enjoying premium entertainment</p>
          <Link to="/register" className="btn-cta">
            Get Started Free
            <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;