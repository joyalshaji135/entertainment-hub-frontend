// pages/AnimeDetail/AnimeDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AnimeDetail.css';

const AnimeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  const API_KEY = '042319157cmsh7c7ddfec2a8370bp186c32jsn0fb395b37716';
  const API_HOST = 'anime-db.p.rapidapi.com';

  useEffect(() => {
    fetchAnimeDetails();
  }, [id]);

  useEffect(() => {
    if (anime) {
      const favorites = JSON.parse(localStorage.getItem('animeFavorites') || '[]');
      setIsFavorite(favorites.some(fav => fav.id === anime.id));
    }
  }, [anime]);

  const fetchAnimeDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try by ID first
      let response = await fetch(`https://anime-db.p.rapidapi.com/anime/by-id/${id}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': API_HOST,
          'x-rapidapi-key': API_KEY
        }
      });

      if (!response.ok) {
        // If by ID fails, try by ranking
        response = await fetch(`https://anime-db.p.rapidapi.com/anime/by-ranking/${id}`, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': API_HOST,
            'x-rapidapi-key': API_KEY
          }
        });
      }

      if (!response.ok) throw new Error('Anime not found');
      
      const data = await response.json();
      setAnime(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('animeFavorites') || '[]');
    
    if (isFavorite) {
      const updated = favorites.filter(fav => fav.id !== anime.id);
      localStorage.setItem('animeFavorites', JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      favorites.push({
        id: anime.id,
        title: anime.title,
        image: anime.image,
        ranking: anime.ranking,
        type: anime.type
      });
      localStorage.setItem('animeFavorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: anime.title,
        text: `Check out ${anime.title} on MyAnimeList`,
        url: anime.link
      });
    } else {
      navigator.clipboard.writeText(anime.link);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="anime-detail-loading">
        <div className="loading-spinner-large"></div>
        <p>Loading anime details...</p>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="anime-detail-error">
        <div className="error-icon">📺</div>
        <h2>Anime Not Found</h2>
        <p>{error || 'Unable to load anime details'}</p>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="anime-detail-container">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="back-button">
        <span className="back-icon">←</span>
        Back
      </button>

      {/* Hero Section */}
      <div className="anime-hero" style={{
        backgroundImage: `linear-gradient(to bottom, rgba(15, 12, 41, 0.9), rgba(15, 12, 41, 0.98)), url(${anime.image})`
      }}>
        <div className="hero-content">
          <div className="anime-cover">
            <img src={anime.image} alt={anime.title} />
            <div className="rank-circle">
              <span className="rank-label">RANK</span>
              <span className="rank-value">#{anime.ranking}</span>
            </div>
          </div>

          <div className="anime-info">
            <div className="anime-badges">
              <span className="type-badge">{anime.type}</span>
              <span className={`status-badge ${anime.status?.toLowerCase().replace(' ', '-')}`}>
                {anime.status}
              </span>
            </div>

            <h1 className="anime-title">{anime.title}</h1>

            <div className="anime-alternative-titles">
              {anime.alternativeTitles?.slice(0, 3).map((title, i) => (
                <span key={i} className="alt-title">{title}</span>
              ))}
            </div>

            <div className="anime-stats">
              <div className="stat">
                <span className="stat-value">{anime.episodes}</span>
                <span className="stat-label">Episodes</span>
              </div>
              <div className="stat">
                <span className="stat-value">{anime.genres?.length}</span>
                <span className="stat-label">Genres</span>
              </div>
            </div>

            <div className="anime-genres">
              {anime.genres?.map(genre => (
                <span key={genre} className="genre-chip">{genre}</span>
              ))}
            </div>

            <div className="anime-actions">
              <button 
                className={`action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={handleAddToFavorites}
              >
                <span className="btn-icon">{isFavorite ? '❤️' : '🤍'}</span>
                {isFavorite ? 'Favorited' : 'Add to Favorites'}
              </button>
              
              <button className="action-btn share-btn" onClick={handleShare}>
                <span className="btn-icon">📤</span>
                Share
              </button>

              <a 
                href={anime.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="action-btn mal-btn"
              >
                <span className="btn-icon">📝</span>
                View on MAL
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="anime-content">
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            Synopsis
          </button>
          <button 
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button 
            className={`tab-btn ${activeTab === 'titles' ? 'active' : ''}`}
            onClick={() => setActiveTab('titles')}
          >
            Alternative Titles
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'about' && (
            <div className="synopsis-tab">
              <h3 className="tab-title">Synopsis</h3>
              <p className="synopsis-text">{anime.synopsis}</p>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="details-tab">
              <h3 className="tab-title">Anime Details</h3>
              
              <div className="details-grid">
                <div className="detail-card">
                  <span className="detail-label">Title</span>
                  <span className="detail-value">{anime.title}</span>
                </div>
                
                <div className="detail-card">
                  <span className="detail-label">Type</span>
                  <span className="detail-value">{anime.type}</span>
                </div>
                
                <div className="detail-card">
                  <span className="detail-label">Episodes</span>
                  <span className="detail-value">{anime.episodes}</span>
                </div>
                
                <div className="detail-card">
                  <span className="detail-label">Status</span>
                  <span className="detail-value">{anime.status}</span>
                </div>
                
                <div className="detail-card">
                  <span className="detail-label">Ranking</span>
                  <span className="detail-value">#{anime.ranking}</span>
                </div>
                
                <div className="detail-card">
                  <span className="detail-label">MAL ID</span>
                  <span className="detail-value">{anime._id}</span>
                </div>
              </div>

              <div className="genres-section">
                <h4>Genres</h4>
                <div className="genres-list">
                  {anime.genres?.map(genre => (
                    <span key={genre} className="genre-item">{genre}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'titles' && (
            <div className="titles-tab">
              <h3 className="tab-title">Alternative Titles</h3>
              <div className="titles-list">
                {anime.alternativeTitles?.map((title, index) => (
                  <div key={index} className="title-item">
                    <span className="title-number">#{index + 1}</span>
                    <span className="title-text">{title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;