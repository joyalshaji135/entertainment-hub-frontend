import React, { useState } from 'react';
import './ArtistCard.css';

const ArtistCard = ({ artist }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFollowClick = (e) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing);
    alert(isFollowing ? `Unfollowed ${artist.name}` : `Following ${artist.name}`);
  };

  return (
    <div 
      className="artist-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="artist-avatar">
        <img src={artist.cover} alt={artist.name} />
        {artist.isVerified && (
          <div className="verified-badge">
            <span className="verified-icon">✓</span>
          </div>
        )}
        <div className={`artist-overlay ${isHovered ? 'visible' : ''}`}>
          <button className="view-artist-btn">
            View Profile
          </button>
        </div>
      </div>
      
      <div className="artist-info">
        <div className="artist-header">
          <h3 className="artist-name">{artist.name}</h3>
          <button 
            className={`follow-btn ${isFollowing ? 'following' : ''}`}
            onClick={handleFollowClick}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
        
        <div className="artist-genres">
          {artist.genre.map((genre, index) => (
            <span key={index} className="genre-badge">{genre}</span>
          ))}
        </div>
        
        <div className="artist-stats">
          <div className="stat-item">
            <div className="stat-number">{artist.followers}</div>
            <div className="stat-label">Followers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{artist.albums}</div>
            <div className="stat-label">Albums</div>
          </div>
        </div>
        
        <div className="artist-actions">
          <button className="action-btn play-btn">
            <span className="btn-icon">▶</span>
            Play All
          </button>
          <button className="action-btn albums-btn">
            <span className="btn-icon">💿</span>
            Albums
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;