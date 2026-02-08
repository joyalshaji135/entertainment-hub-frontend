import React, { useState } from 'react';
import './PlaylistCard.css';

const PlaylistCard = ({ playlist }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFollowClick = (e) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing);
    alert(isFollowing ? 'Removed from library' : 'Added to your library!');
  };

  return (
    <div 
      className="playlist-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="playlist-cover">
        <img src={playlist.cover} alt={playlist.title} />
        <div className={`playlist-overlay ${isHovered ? 'visible' : ''}`}>
          <button className="play-playlist-btn">
            <span className="play-icon">▶</span>
          </button>
        </div>
        
        <div className="playlist-stats">
          <div className="stat-badge">
            <span className="stat-icon">🎵</span>
            <span className="stat-value">{playlist.tracks}</span>
          </div>
          <div className="stat-badge">
            <span className="stat-icon">⏱️</span>
            <span className="stat-value">{playlist.duration}</span>
          </div>
        </div>
      </div>
      
      <div className="playlist-info">
        <div className="playlist-header">
          <h3 className="playlist-title">{playlist.title}</h3>
          <button 
            className={`follow-playlist-btn ${isFollowing ? 'following' : ''}`}
            onClick={handleFollowClick}
          >
            {isFollowing ? '✓' : '+'}
          </button>
        </div>
        
        <p className="playlist-creator">By {playlist.creator}</p>
        
        <div className="playlist-meta">
          <div className="meta-item">
            <span className="meta-icon">❤️</span>
            <span>{playlist.followers} followers</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">🌐</span>
            <span>{playlist.isPublic ? 'Public' : 'Private'}</span>
          </div>
        </div>
        
        <div className="playlist-genres">
          {playlist.genre.map((genre, index) => (
            <span key={index} className="genre-pill">{genre}</span>
          ))}
        </div>
        
        <div className="playlist-actions">
          <button className="action-btn play-btn">
            <span className="btn-icon">▶</span>
            Play All
          </button>
          <button className="action-btn shuffle-btn">
            <span className="btn-icon">🔀</span>
            Shuffle
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;