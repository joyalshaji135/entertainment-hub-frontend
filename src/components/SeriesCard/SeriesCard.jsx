import React, { useState } from 'react';
import './SeriesCard.css';

const SeriesCard = ({ series }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // In a real app, this would update the user's favorites in the backend
    alert(isFavorite ? 'Removed from favorites' : 'Added to favorites!');
  };

  const handleWatchClick = (e) => {
    e.stopPropagation();
    alert(`Starting "${series.title}"...`);
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  const getRatingColor = (rating) => {
    if (rating >= 8.5) return '#4ecdc4';
    if (rating >= 7.5) return '#ffd166';
    if (rating >= 6.5) return '#ff9a3c';
    return '#ff6b6b';
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'ongoing': return '#4ecdc4';
      case 'ended': return '#ff6b6b';
      case 'upcoming': return '#ffd166';
      default: return '#888';
    }
  };

  return (
    <div 
      className={`series-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="card-inner">
        {/* Card Image */}
        <div className="card-image">
          <img src={series.image} alt={series.title} />
          <div className="image-overlay">
            <button className="play-overlay-btn">
              <span className="play-icon">▶</span>
            </button>
          </div>
          
          {/* Badges */}
          <div className="card-badges">
            {series.isNew && (
              <span className="badge new-badge">NEW</span>
            )}
            {series.isFeatured && (
              <span className="badge featured-badge">FEATURED</span>
            )}
            <span 
              className="badge status-badge"
              style={{ backgroundColor: getStatusColor(series.status) }}
            >
              {series.status}
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
            <button 
              className="quick-action watch-action"
              onClick={handleWatchClick}
              title="Watch now"
            >
              <span className="action-icon">▶</span>
            </button>
          </div>
        </div>

        {/* Card Content */}
        <div className="card-content">
          <div className="card-header">
            <h3 className="series-title">{series.title}</h3>
            <div className="series-year">{series.year}</div>
          </div>
          
          <div className="series-meta">
            <div className="meta-item rating" style={{ color: getRatingColor(series.rating) }}>
              <span className="star">⭐</span>
              <span className="rating-value">{series.rating}</span>
            </div>
            <div className="meta-item seasons">
              <span className="meta-icon">📺</span>
              <span>{series.seasons} Season{series.seasons !== 1 ? 's' : ''}</span>
            </div>
            <div className="meta-item episodes">
              <span className="meta-icon">🎬</span>
              <span>{series.episodes} Episodes</span>
            </div>
          </div>
          
          <div className="series-genres">
            {series.genre.map((genre, index) => (
              <span key={index} className="genre-tag">{genre}</span>
            ))}
          </div>
          
          <p className="series-description">{series.description}</p>
          
          <div className="series-network">
            <span className="network-icon">📡</span>
            <span className="network-name">{series.network}</span>
          </div>

          {/* Expanded Details */}
          {showDetails && (
            <div className="expanded-details">
              <div className="details-section">
                <h4>Cast</h4>
                <div className="cast-list">
                  {series.cast.slice(0, 3).map((actor, index) => (
                    <span key={index} className="cast-member">{actor}</span>
                  ))}
                  {series.cast.length > 3 && (
                    <span className="more-cast">+{series.cast.length - 3} more</span>
                  )}
                </div>
              </div>
              
              <div className="details-section">
                <h4>Details</h4>
                <div className="detail-items">
                  <div className="detail-item">
                    <span className="detail-label">IMDb:</span>
                    <span className="detail-value">{series.imdb}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Seasons:</span>
                    <span className="detail-value">{series.seasons}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Episodes:</span>
                    <span className="detail-value">{series.episodes}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span 
                      className="detail-value status"
                      style={{ color: getStatusColor(series.status) }}
                    >
                      {series.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="action-buttons">
                <button className="action-btn watch-now" onClick={handleWatchClick}>
                  <span className="btn-icon">▶</span>
                  Watch Now
                </button>
                <button className="action-btn watch-trailer">
                  <span className="btn-icon">🎬</span>
                  Trailer
                </button>
                <button className="action-btn add-watchlist" onClick={handleFavoriteClick}>
                  <span className="btn-icon">{isFavorite ? '❤️' : '🤍'}</span>
                  {isFavorite ? 'In Watchlist' : 'Watchlist'}
                </button>
              </div>
            </div>
          )}
          
          {/* Quick View Toggle */}
          <button 
            className="details-toggle"
            onClick={handleDetailsClick}
          >
            {showDetails ? 'Show Less' : 'View Details'}
            <span className="toggle-arrow">{showDetails ? '↑' : '↓'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeriesCard;