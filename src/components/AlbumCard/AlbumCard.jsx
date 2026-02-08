import React, { useState } from 'react';
import './AlbumCard.css';

const AlbumCard = ({ album, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    alert(isFavorite ? 'Removed from favorites' : 'Added to favorites!');
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlay?.(album);
  };

  const getTypeColor = (type) => {
    switch(type.toLowerCase()) {
      case 'album': return '#4ecdc4';
      case 'ep': return '#ffd166';
      case 'single': return '#ef476f';
      default: return '#888';
    }
  };

  return (
    <div 
      className="album-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlayClick}
    >
      <div className="album-cover">
        <img src={album.cover} alt={album.title} />
        <div className={`album-overlay ${isHovered ? 'visible' : ''}`}>
          <button className="play-album-btn">
            <span className="play-icon">▶</span>
          </button>
        </div>
        
        <div className="album-badges">
          <span 
            className="album-type-badge"
            style={{ backgroundColor: getTypeColor(album.type) }}
          >
            {album.type}
          </span>
          {album.isExplicit && (
            <span className="explicit-badge">E</span>
          )}
        </div>
        
        <div className="album-actions">
          <button 
            className="album-action favorite-action"
            onClick={handleFavoriteClick}
          >
            <span className="action-icon">
              {isFavorite ? '❤️' : '🤍'}
            </span>
          </button>
        </div>
      </div>
      
      <div className="album-info">
        <h3 className="album-title">{album.title}</h3>
        <p className="album-artist">{album.artist}</p>
        
        <div className="album-meta">
          <div className="meta-item">
            <span className="meta-icon">🎵</span>
            <span>{album.tracks} tracks</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span>{album.duration}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span>{album.year}</span>
          </div>
        </div>
        
        <div className="album-genres">
          {album.genre.map((genre, index) => (
            <span key={index} className="genre-tag">{genre}</span>
          ))}
        </div>
        
        <div className="album-actions-bottom">
          <button className="action-btn play-btn" onClick={handlePlayClick}>
            <span className="btn-icon">▶</span>
            Play
          </button>
          <button className="action-btn add-btn" onClick={handleFavoriteClick}>
            <span className="btn-icon">{isFavorite ? '❤️' : '+'}</span>
            {isFavorite ? 'Liked' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;