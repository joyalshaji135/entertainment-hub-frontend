// pages/MovieDetail/MovieDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://imdb-top-100-movies.p.rapidapi.com/${id}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'imdb-top-100-movies.p.rapidapi.com',
          'x-rapidapi-key': '042319157cmsh7c7ddfec2a8370bp186c32jsn0fb395b37716'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }

      const data = await response.json();
      setMovie(data);
      
      // Check if movie is in watchlist
      const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
      setIsInWatchlist(watchlist.some(item => item.id === data.id));
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    
    if (isInWatchlist) {
      // Remove from watchlist
      const updatedWatchlist = watchlist.filter(item => item.id !== movie.id);
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      setIsInWatchlist(false);
      alert('Removed from watchlist');
    } else {
      // Add to watchlist
      watchlist.push({
        id: movie.id,
        title: movie.title,
        image: movie.image,
        rating: movie.rating,
        year: movie.year
      });
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      setIsInWatchlist(true);
      alert('Added to watchlist');
    }
  };

  const handleWatchNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Navigate to video player or streaming page
    navigate(`/watch/${movie.id}`);
  };

  if (loading) {
    return (
      <div className="movie-detail-loading">
        <div className="loading-spinner-large"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-detail-error">
        <div className="error-icon">🎬</div>
        <h2>Movie Not Found</h2>
        <p>{error || 'Unable to load movie details'}</p>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="movie-detail-container">
      {/* Hero Section with Backdrop */}
      <div 
        className="movie-hero"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 12, 41, 0.8), rgba(15, 12, 41, 0.95)), url(${movie.big_image || movie.image})`
        }}
      >
        <button onClick={() => navigate(-1)} className="back-button">
          <span className="back-icon">←</span>
          Back
        </button>

        <div className="hero-content">
          <div className="movie-poster">
            <img src={movie.image} alt={movie.title} />
            {movie.rating && (
              <div className="poster-rating">
                <span className="rating-star">⭐</span>
                <span className="rating-value">{movie.rating}</span>
              </div>
            )}
          </div>

          <div className="movie-hero-info">
            <div className="movie-badges">
              {movie.rank && (
                <span className="rank-badge">
                  <span className="rank-icon">👑</span>
                  Top #{movie.rank}
                </span>
              )}
              {movie.year && (
                <span className="year-badge">{movie.year}</span>
              )}
            </div>

            <h1 className="movie-title">{movie.title}</h1>

            <div className="movie-metadata">
              {movie.genre && movie.genre.map((genre, index) => (
                <span key={index} className="metadata-item">{genre}</span>
              ))}
            </div>

            <div className="movie-actions-hero">
              <button className="watch-now-btn" onClick={handleWatchNow}>
                <span className="btn-icon">▶</span>
                Watch Now
              </button>
              <button 
                className={`watchlist-btn ${isInWatchlist ? 'in-watchlist' : ''}`}
                onClick={handleAddToWatchlist}
              >
                <span className="btn-icon">{isInWatchlist ? '✓' : '+'}</span>
                {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
              {movie.trailer && (
                <a 
                  href={movie.trailer} 
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
      <div className="movie-content">
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button 
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          {movie.trailer && (
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
              <p className="movie-description">{movie.description}</p>
              
              {movie.director && movie.director.length > 0 && (
                <div className="credits-section">
                  <h4>Director</h4>
                  <div className="credits-list">
                    {movie.director.map((director, index) => (
                      <span key={index} className="credit-item">{director}</span>
                    ))}
                  </div>
                </div>
              )}

              {movie.writers && movie.writers.length > 0 && (
                <div className="credits-section">
                  <h4>Writers</h4>
                  <div className="credits-list">
                    {movie.writers.map((writer, index) => (
                      <span key={index} className="credit-item">{writer}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="details-tab">
              <h3 className="tab-title">Movie Details</h3>
              
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Original Title</span>
                  <span className="detail-value">{movie.title}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Release Year</span>
                  <span className="detail-value">{movie.year}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">IMDb Rating</span>
                  <span className="detail-value rating">
                    ⭐ {movie.rating}/10
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Rank</span>
                  <span className="detail-value">#{movie.rank}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Genre</span>
                  <span className="detail-value">
                    {movie.genre?.join(', ')}
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">IMDb ID</span>
                  <span className="detail-value">
                    <a 
                      href={movie.imdb_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="imdb-link"
                    >
                      {movie.imdbid}
                    </a>
                  </span>
                </div>
              </div>

              {movie.director && movie.director.length > 0 && (
                <div className="details-section">
                  <h4>Director{movie.director.length > 1 ? 's' : ''}</h4>
                  <div className="details-person-list">
                    {movie.director.map((person, index) => (
                      <div key={index} className="person-card">
                        <div className="person-icon">🎬</div>
                        <span className="person-name">{person}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {movie.writers && movie.writers.length > 0 && (
                <div className="details-section">
                  <h4>Writer{movie.writers.length > 1 ? 's' : ''}</h4>
                  <div className="details-person-list">
                    {movie.writers.map((person, index) => (
                      <div key={index} className="person-card">
                        <div className="person-icon">✍️</div>
                        <span className="person-name">{person}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'trailer' && movie.trailer_embed_link && (
            <div className="trailer-tab">
              <h3 className="tab-title">Official Trailer</h3>
              <div className="trailer-container">
                <iframe
                  src={movie.trailer_embed_link}
                  title={`${movie.title} Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="quick-actions">
        <button className="quick-action-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="action-icon">⬆️</span>
          Back to Top
        </button>
        <a 
          href={movie.imdb_link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="quick-action-btn"
        >
          <span className="action-icon">🎬</span>
          View on IMDb
        </a>
      </div>
    </div>
  );
};

export default MovieDetail;