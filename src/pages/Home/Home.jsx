import React, { useState } from 'react';
import './Home.css';
import MovieSlider from '../../components/MovieSlider/MovieSlider';
import MovieList from '../../components/MovieList/MovieList';

const Home = () => {
  const [activeSection, setActiveSection] = useState('movies');

  const sections = [
    { id: 'movies', label: 'Movies', icon: '🎬' },
    { id: 'series', label: 'TV Series', icon: '📺' },
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'games', label: 'Games', icon: '🎮' },
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'watchlist', label: 'Watchlist', icon: '❤️' },
  ];

  const featuredContent = [
    {
      type: 'featured',
      title: 'Exclusive Content',
      items: [
        { title: 'Original Series', count: '25+', icon: '🎭' },
        { title: 'Exclusive Movies', count: '50+', icon: '🎬' },
        { title: 'Live Events', count: '10+', icon: '🎪' },
      ]
    },
    {
      type: 'stats',
      title: 'Platform Stats',
      items: [
        { title: 'Active Users', count: '2.5M+', icon: '👥' },
        { title: 'Hours Watched', count: '50M+', icon: '⏱️' },
        { title: 'New Releases', count: '100+', icon: '🆕' },
      ]
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section with Slider */}
      <section className="hero-section">
        <MovieSlider />
      </section>

      {/* Quick Access Sections */}
      <section className="quick-access">
        <div className="section-header">
          <h2 className="section-title">Browse Categories</h2>
          <p className="section-subtitle">Explore our vast collection of entertainment</p>
        </div>
        
        <div className="sections-grid">
          {sections.map((section) => (
            <div 
              key={section.id}
              className={`section-card ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <div className="section-icon">{section.icon}</div>
              <h3 className="section-name">{section.label}</h3>
              <div className="section-hover">
                <span className="hover-text">Explore →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Content & Stats */}
      <section className="featured-section">
        {featuredContent.map((feature, index) => (
          <div key={index} className="featured-card">
            <h3 className="featured-title">{feature.title}</h3>
            <div className="featured-items">
              {feature.items.map((item, itemIndex) => (
                <div key={itemIndex} className="featured-item">
                  <div className="item-icon">{item.icon}</div>
                  <div className="item-content">
                    <div className="item-count">{item.count}</div>
                    <div className="item-title">{item.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Movie Listings */}
      <section className="listings-section">
        <MovieList />
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="promo-content">
          <div className="promo-text">
            <h2 className="promo-title">Upgrade to Premium</h2>
            <p className="promo-description">
              Get access to all premium content, 4K streaming, and exclusive features.
              No ads, no limits.
            </p>
            <button className="promo-btn">
              Upgrade Now
              <span className="promo-icon">🚀</span>
            </button>
          </div>
          <div className="promo-badge">
            <span className="badge-text">50% OFF</span>
            <span className="badge-subtext">First Month</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;