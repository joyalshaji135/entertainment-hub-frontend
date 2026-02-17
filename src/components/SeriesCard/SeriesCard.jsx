// components/SeriesCard/SeriesCard.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './SeriesCard.css';

const SeriesCard = ({ series, style }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsFavorite(!isFavorite);
    
    // Update watchlist in localStorage
    const watchlist = JSON.parse(localStorage.getItem('seriesWatchlist') || '[]');
    
    if (!isFavorite) {
      watchlist.push({
        id: series.id,
        title: series.title,
        image: series.image,
        rating: series.rating,
        year: series.year
      });
    } else {
      const index = watchlist.findIndex(item => item.id === series.id);
      if (index !== -1) watchlist.splice(index, 1);
    }
    
    localStorage.setItem('seriesWatchlist', JSON.stringify(watchlist));
  };

  const handleWatchClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    navigate(`/watch/series/${series.id}`);
  };

  const handleTrailerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (series.trailer) {
      window.open(series.trailer, '_blank');
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 9) return '#4ecdc4';
    if (rating >= 8) return '#ffd166';
    if (rating >= 7) return '#ff9a3c';
    return '#ff6b6b';
  };

  const getYearDisplay = (year) => {
    if (typeof year === 'string' && year.includes('-')) {
      return year;
    }
    return year.toString();
  };

  return (
    <Link 
      to={`/series/${series.id}`}
      className="series-card-link"
      style={style}
    >
      <div 
        className={`series-card ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="card-inner">
          {/* Card Image */}
          <div className="card-image">
            <img 
              src={series.image} 
              alt={series.title}
              loading="lazy"
            />
            <div className="image-overlay">
              <button 
                className="play-overlay-btn"
                onClick={handleWatchClick}
              >
                <span className="play-icon">▶</span>
              </button>
            </div>
            
            {/* Badges */}
            <div className="card-badges">
              {series.rank <= 10 && (
                <span className="badge top-badge">TOP {series.rank}</span>
              )}
              {series.isNew && (
                <span className="badge new-badge">NEW</span>
              )}
              <span 
                className="badge status-badge"
                style={{ 
                  backgroundColor: series.status === 'Ongoing' ? '#4ecdc4' : 
                                  series.status === 'Ended' ? '#ff6b6b' : '#ffd166'
                }}
              >
                {series.status || 'Ongoing'}
              </span>
            </div>
            
            {/* Quick Actions */}
            <div className="quick-actions">
              <button 
                className="quick-action favorite-action"
                onClick={handleFavoriteClick}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <span className={`action-icon ${isFavorite ? 'favorited' : ''}`}>
                  {isFavorite ? '❤️' : '🤍'}
                </span>
              </button>
              {series.trailer && (
                <button 
                  className="quick-action trailer-action"
                  onClick={handleTrailerClick}
                  title="Watch trailer"
                >
                  <span className="action-icon">🎬</span>
                </button>
              )}
            </div>
          </div>

          {/* Card Content */}
          <div className="card-content">
            <div className="card-header">
              <h3 className="series-title">{series.title}</h3>
              <div className="series-year">{getYearDisplay(series.year)}</div>
            </div>
            
            <div className="series-meta">
              <div className="meta-item rating" style={{ color: getRatingColor(series.rating) }}>
                <span className="star">⭐</span>
                <span className="rating-value">{series.rating}</span>
              </div>
              {series.seasons && (
                <div className="meta-item seasons">
                  <span className="meta-icon">📺</span>
                  <span>{series.seasons} Season{series.seasons !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
            
            <div className="series-genres">
              {series.genre && series.genre.slice(0, 3).map((genre, index) => (
                <span key={index} className="genre-tag">{genre}</span>
              ))}
            </div>
            
            <p className="series-description">
              {series.description && series.description.length > 100
                ? `${series.description.substring(0, 100)}...`
                : series.description}
            </p>
            
            {series.network && (
              <div className="series-network">
                <span className="network-icon">📡</span>
                <span className="network-name">{series.network}</span>
              </div>
            )}

            {/* Quick View Toggle */}
            <button 
              className="details-toggle"
              onClick={(e) => {
                e.preventDefault();
                setShowDetails(!showDetails);
              }}
            >
              {showDetails ? 'Show Less' : 'Quick View'}
              <span className="toggle-arrow">{showDetails ? '↑' : '↓'}</span>
            </button>

            {/* Expanded Details */}
            {showDetails && (
              <div className="expanded-details">
                <div className="action-buttons">
                  <button className="action-btn watch-now" onClick={handleWatchClick}>
                    <span className="btn-icon">▶</span>
                    Watch Now
                  </button>
                  {series.trailer && (
                    <button className="action-btn watch-trailer" onClick={handleTrailerClick}>
                      <span className="btn-icon">🎬</span>
                      Trailer
                    </button>
                  )}
                  <button className="action-btn add-watchlist" onClick={handleFavoriteClick}>
                    <span className="btn-icon">{isFavorite ? '❤️' : '🤍'}</span>
                    {isFavorite ? 'In List' : 'Watchlist'}
                  </button>
                </div>

                <div className="details-section">
                  <h4>Details</h4>
                  <div className="detail-items">
                    <div className="detail-item">
                      <span className="detail-label">IMDb:</span>
                      <span className="detail-value">
                        <a 
                          href={series.imdb_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {series.imdbid}
                        </a>
                      </span>
                    </div>
                    {series.seasons && (
                      <div className="detail-item">
                        <span className="detail-label">Seasons:</span>
                        <span className="detail-value">{series.seasons}</span>
                      </div>
                    )}
                    {series.episodes && (
                      <div className="detail-item">
                        <span className="detail-label">Episodes:</span>
                        <span className="detail-value">{series.episodes}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span 
                        className="detail-value status"
                        style={{ 
                          color: series.status === 'Ongoing' ? '#4ecdc4' : 
                                 series.status === 'Ended' ? '#ff6b6b' : '#ffd166'
                        }}
                      >
                        {series.status || 'Ongoing'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SeriesCard;