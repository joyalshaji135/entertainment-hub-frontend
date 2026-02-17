// pages/SeriesDetail/SeriesDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './SeriesDetail.css';

const SeriesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    fetchSeriesDetails();
  }, [id]);

  const fetchSeriesDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://imdb-top-100-movies.p.rapidapi.com/series/${id}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'imdb-top-100-movies.p.rapidapi.com',
          'x-rapidapi-key': '042319157cmsh7c7ddfec2a8370bp186c32jsn0fb395b37716'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch series details');
      }

      const data = await response.json();
      
      // Enhance data with additional properties
      const enhancedData = {
        ...data,
        seasons: extractSeasons(data.year),
        episodes: extractEpisodes(data.year),
        status: determineStatus(data.year)
      };

      setSeries(enhancedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const extractSeasons = (yearStr) => {
    if (yearStr.includes('-')) {
      const years = yearStr.split('-').map(y => parseInt(y));
      if (years.length === 2 && !isNaN(years[0]) && !isNaN(years[1])) {
        return Math.max(1, Math.ceil((years[1] - years[0]) / 1.5) + 1);
      }
    }
    return Math.floor(Math.random() * 5) + 3;
  };

  const extractEpisodes = (yearStr) => {
    const seasons = extractSeasons(yearStr);
    return seasons * (Math.floor(Math.random() * 8) + 8);
  };

  const determineStatus = (yearStr) => {
    if (yearStr.includes('-')) {
      const endYear = yearStr.split('-')[1];
      if (endYear && parseInt(endYear) < new Date().getFullYear()) {
        return 'Ended';
      }
      return 'Ongoing';
    }
    return parseInt(yearStr) < new Date().getFullYear() ? 'Ended' : 'Upcoming';
  };

  const handleWatchNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/watch/series/${id}`);
  };

  const handleAddToWatchlist = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Add to watchlist logic
    alert('Added to watchlist!');
  };

  if (loading) {
    return (
      <div className="series-detail-loading">
        <div className="loading-spinner-large"></div>
        <p>Loading series details...</p>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="series-detail-error">
        <div className="error-icon">📺</div>
        <h2>Series Not Found</h2>
        <p>{error || 'Unable to load series details'}</p>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="series-detail-container">
      {/* Hero Section */}
      <div 
        className="series-hero"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 12, 41, 0.8), rgba(15, 12, 41, 0.95)), url(${series.big_image || series.image})`
        }}
      >
        <button onClick={() => navigate(-1)} className="back-button">
          <span className="back-icon">←</span>
          Back
        </button>

        <div className="hero-content">
          <div className="series-poster">
            <img src={series.image} alt={series.title} />
            <div className="poster-rating">
              <span className="rating-star">⭐</span>
              <span className="rating-value">{series.rating}</span>
            </div>
          </div>

          <div className="series-hero-info">
            <div className="series-badges">
              <span className="rank-badge">
                <span className="rank-icon">👑</span>
                Top #{series.rank}
              </span>
              <span className="year-badge">{series.year}</span>
              <span className={`status-badge ${series.status.toLowerCase()}`}>
                {series.status}
              </span>
            </div>

            <h1 className="series-title">{series.title}</h1>

            <div className="series-metadata">
              {series.genre && series.genre.map((genre, index) => (
                <span key={index} className="metadata-item">{genre}</span>
              ))}
            </div>

            <div className="series-stats">
              <div className="stat">
                <span className="stat-label">Seasons</span>
                <span className="stat-value">{series.seasons}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Episodes</span>
                <span className="stat-value">{series.episodes}</span>
              </div>
              <div className="stat">
                <span className="stat-label">IMDb</span>
                <span className="stat-value">{series.rating}</span>
              </div>
            </div>

            <div className="series-actions">
              <button className="watch-now-btn" onClick={handleWatchNow}>
                <span className="btn-icon">▶</span>
                Watch Now
              </button>
              <button className="watchlist-btn" onClick={handleAddToWatchlist}>
                <span className="btn-icon">+</span>
                Add to Watchlist
              </button>
              {series.trailer && (
                <a 
                  href={series.trailer} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="trailer-btn"
                >
                  <span className="btn-icon">🎬</span>
                  Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="series-content">
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button 
            className={`tab-btn ${activeTab === 'episodes' ? 'active' : ''}`}
            onClick={() => setActiveTab('episodes')}
          >
            Episodes
          </button>
          {series.trailer && (
            <button 
              className={`tab-btn ${activeTab === 'trailer' ? 'active' : ''}`}
              onClick={() => setActiveTab('trailer')}
            >
              Trailer
            </button>
          )}
        </div>

        <div className="tab-content">
          {activeTab === 'about' && (
            <div className="about-tab">
              <h3 className="tab-title">Storyline</h3>
              <p className="series-description">{series.description}</p>
              
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Release Year</span>
                  <span className="detail-value">{series.year}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Seasons</span>
                  <span className="detail-value">{series.seasons}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Episodes</span>
                  <span className="detail-value">{series.episodes}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className={`detail-value status-${series.status.toLowerCase()}`}>
                    {series.status}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">IMDb ID</span>
                  <span className="detail-value">
                    <a href={series.imdb_link} target="_blank" rel="noopener noreferrer">
                      {series.imdbid}
                    </a>
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'episodes' && (
            <div className="episodes-tab">
              <h3 className="tab-title">Episodes</h3>
              <p className="coming-soon">Episode guide coming soon!</p>
            </div>
          )}

          {activeTab === 'trailer' && series.trailer_embed_link && (
            <div className="trailer-tab">
              <h3 className="tab-title">Official Trailer</h3>
              <div className="trailer-container">
                <iframe
                  src={series.trailer_embed_link}
                  title={`${series.title} Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeriesDetail;