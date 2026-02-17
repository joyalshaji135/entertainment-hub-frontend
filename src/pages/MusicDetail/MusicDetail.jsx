// pages/MusicDetail/MusicDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './MusicDetail.css';

const MusicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [loadingLyrics, setLoadingLyrics] = useState(false);

  useEffect(() => {
    fetchSongDetails();
  }, [id]);

  useEffect(() => {
    if (song && activeTab === 'lyrics') {
      fetchLyrics();
    }
  }, [activeTab, song]);

  const fetchSongDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First, search for the song by ID
      const searchResponse = await fetch(`https://genius-song-lyrics1.p.rapidapi.com/search/?q=${id}&per_page=1`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'genius-song-lyrics1.p.rapidapi.com',
          'x-rapidapi-key': '042319157cmsh7c7ddfec2a8370bp186c32jsn0fb395b37716'
        }
      });

      if (!searchResponse.ok) {
        throw new Error('Failed to fetch song details');
      }

      const searchData = await searchResponse.json();
      
      if (searchData.hits && searchData.hits.length > 0) {
        const songData = searchData.hits[0].result;
        
        // Enhance with additional data
        const enhancedSong = {
          id: songData.id,
          title: songData.title,
          artist: songData.artist_names,
          cover: songData.song_art_image_url || songData.header_image_url,
          thumbnail: songData.song_art_image_thumbnail_url,
          releaseDate: songData.release_date_for_display,
          year: songData.release_date_components?.year,
          views: formatPageViews(songData.stats?.pageviews),
          url: songData.url,
          api_path: songData.api_path,
          description: `${songData.title} by ${songData.artist_names}`,
          genre: extractGenre(songData),
          explicit: checkExplicit(songData),
          featuredArtists: songData.featured_artists || [],
          primaryArtist: songData.primary_artist,
          album: songData.album?.name || 'Single',
          annotations: songData.annotation_count || 0,
          pyongs: songData.pyongs_count || 0
        };
        
        setSong(enhancedSong);
        
        // Check if in favorites
        const favorites = JSON.parse(localStorage.getItem('musicFavorites') || '[]');
        setIsFavorite(favorites.some(fav => fav.id === enhancedSong.id));
      } else {
        throw new Error('Song not found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLyrics = async () => {
    if (!song || lyrics) return;
    
    setLoadingLyrics(true);
    
    try {
      // Note: Genius API requires a separate endpoint for lyrics
      // For demo purposes, we'll use a placeholder
      // In production, you'd need to use a lyrics API or scrape
      const mockLyrics = `[Intro]
Yeah, yeah
Oh-oh

[Verse 1]
This is a placeholder for the lyrics of "${song.title}" by ${song.artist}
In a production environment, you would need to use a lyrics API
or implement web scraping to get actual lyrics.

[Chorus]
The actual lyrics would appear here
With proper formatting and line breaks
Showing the complete song text

[Verse 2]
You can integrate services like Lyrics.ovh
Or Genius's own lyrics API if available
For now, this is a placeholder

[Outro]
Thank you for using our music player
Enjoy the song!`;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLyrics(mockLyrics);
    } catch (err) {
      console.error('Error fetching lyrics:', err);
      setLyrics('Lyrics not available for this song.');
    } finally {
      setLoadingLyrics(false);
    }
  };

  const formatPageViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const extractGenre = (songData) => {
    // Genius API doesn't provide genre directly
    const defaultGenres = ['Pop', 'Hip Hop', 'R&B', 'Rock', 'Alternative'];
    return [defaultGenres[Math.floor(Math.random() * defaultGenres.length)]];
  };

  const checkExplicit = (songData) => {
    const explicitKeywords = ['explicit', 'dirty', 'uncensored'];
    const titleLower = songData.title?.toLowerCase() || '';
    return explicitKeywords.some(keyword => titleLower.includes(keyword));
  };

  const handlePlayPause = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleAddToFavorites = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('musicFavorites') || '[]');
    
    if (isFavorite) {
      const updated = favorites.filter(fav => fav.id !== song.id);
      localStorage.setItem('musicFavorites', JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      favorites.push({
        id: song.id,
        title: song.title,
        artist: song.artist,
        cover: song.cover,
        year: song.year
      });
      localStorage.setItem('musicFavorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: song.title,
        text: `Check out ${song.title} by ${song.artist}`,
        url: song.url
      });
    } else {
      navigator.clipboard.writeText(song.url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="music-detail-loading">
        <div className="loading-spinner-large"></div>
        <p>Loading song details...</p>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="music-detail-error">
        <div className="error-icon">🎵</div>
        <h2>Song Not Found</h2>
        <p>{error || 'Unable to load song details'}</p>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="music-detail-container">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="back-button">
        <span className="back-icon">←</span>
        Back
      </button>

      {/* Hero Section */}
      <div className="song-hero">
        <div className="hero-content">
          <div className="song-cover-container">
            <img 
              src={song.cover} 
              alt={song.title} 
              className="song-cover"
            />
            <div className="cover-overlay">
              <button 
                className="play-large-btn"
                onClick={handlePlayPause}
              >
                <span className="play-icon">{isPlaying ? '⏸️' : '▶️'}</span>
              </button>
            </div>
          </div>

          <div className="song-info">
            <div className="song-badges">
              {song.explicit && (
                <span className="explicit-badge">EXPLICIT</span>
              )}
              {song.year && (
                <span className="year-badge">{song.year}</span>
              )}
              {song.views && (
                <span className="views-badge">
                  ⭐ {song.views} views
                </span>
              )}
            </div>

            <h1 className="song-title">{song.title}</h1>
            
            <div className="song-artist">
              <span className="artist-label">by</span>
              <span className="artist-name">{song.artist}</span>
            </div>

            {song.primaryArtist && (
              <div className="primary-artist">
                <img 
                  src={song.primaryArtist.image_url} 
                  alt={song.primaryArtist.name}
                  className="artist-thumb"
                />
                <span>{song.primaryArtist.name}</span>
              </div>
            )}

            <div className="song-meta">
              <div className="meta-item">
                <span className="meta-icon">💿</span>
                <span className="meta-text">{song.album}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <span className="meta-text">{song.releaseDate || 'Unknown'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">🎤</span>
                <span className="meta-text">{song.genre.join(', ')}</span>
              </div>
            </div>

            <div className="song-stats">
              <div className="stat">
                <span className="stat-value">{song.annotations}</span>
                <span className="stat-label">Annotations</span>
              </div>
              <div className="stat">
                <span className="stat-value">{song.pyongs}</span>
                <span className="stat-label">Pyongs</span>
              </div>
            </div>

            <div className="song-actions">
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
                href={song.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="action-btn genius-btn"
              >
                <span className="btn-icon">📝</span>
                View on Genius
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="song-content">
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button 
            className={`tab-btn ${activeTab === 'lyrics' ? 'active' : ''}`}
            onClick={() => setActiveTab('lyrics')}
          >
            Lyrics
          </button>
          <button 
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button 
            className={`tab-btn ${activeTab === 'similar' ? 'active' : ''}`}
            onClick={() => setActiveTab('similar')}
          >
            Similar Songs
          </button>
        </div>

        <div className="tab-content">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="about-tab">
              <h3 className="tab-title">About this song</h3>
              
              <div className="song-description">
                <p>{song.description}</p>
                {song.primaryArtist && (
                  <div className="artist-bio">
                    <h4>About {song.primaryArtist.name}</h4>
                    <p>Learn more about the artist on Genius</p>
                    <a 
                      href={song.primaryArtist.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="artist-link"
                    >
                      View Artist Profile →
                    </a>
                  </div>
                )}
              </div>

              {song.featuredArtists && song.featuredArtists.length > 0 && (
                <div className="featured-artists">
                  <h4>Featured Artists</h4>
                  <div className="artists-list">
                    {song.featuredArtists.map((artist, index) => (
                      <div key={index} className="featured-artist">
                        {artist.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lyrics Tab */}
          {activeTab === 'lyrics' && (
            <div className="lyrics-tab">
              <h3 className="tab-title">Lyrics</h3>
              
              {loadingLyrics ? (
                <div className="lyrics-loading">
                  <div className="loading-spinner-small"></div>
                  <p>Loading lyrics...</p>
                </div>
              ) : (
                <div className="lyrics-container">
                  <pre className="lyrics-text">{lyrics}</pre>
                </div>
              )}
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="details-tab">
              <h3 className="tab-title">Song Details</h3>
              
              <div className="details-grid">
                <div className="detail-card">
                  <div className="detail-icon">🎵</div>
                  <div className="detail-content">
                    <span className="detail-label">Title</span>
                    <span className="detail-value">{song.title}</span>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-icon">🎤</div>
                  <div className="detail-content">
                    <span className="detail-label">Artist</span>
                    <span className="detail-value">{song.artist}</span>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-icon">💿</div>
                  <div className="detail-content">
                    <span className="detail-label">Album</span>
                    <span className="detail-value">{song.album}</span>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-icon">📅</div>
                  <div className="detail-content">
                    <span className="detail-label">Release Date</span>
                    <span className="detail-value">{song.releaseDate}</span>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-icon">🎼</div>
                  <div className="detail-content">
                    <span className="detail-label">Genre</span>
                    <span className="detail-value">{song.genre.join(', ')}</span>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-icon">⭐</div>
                  <div className="detail-content">
                    <span className="detail-label">Views</span>
                    <span className="detail-value">{song.views}</span>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-icon">📝</div>
                  <div className="detail-content">
                    <span className="detail-label">Annotations</span>
                    <span className="detail-value">{song.annotations}</span>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-icon">🔥</div>
                  <div className="detail-content">
                    <span className="detail-label">Pyongs</span>
                    <span className="detail-value">{song.pyongs}</span>
                  </div>
                </div>
              </div>

              <div className="genius-link">
                <a 
                  href={song.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="genius-link-btn"
                >
                  View Full Details on Genius →
                </a>
              </div>
            </div>
          )}

          {/* Similar Songs Tab */}
          {activeTab === 'similar' && (
            <div className="similar-tab">
              <h3 className="tab-title">Similar Songs</h3>
              
              <div className="similar-grid">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="similar-song-card">
                    <div className="similar-song-image">
                      <img 
                        src={song.cover} 
                        alt={`Similar song ${index + 1}`}
                      />
                      <button className="play-similar-btn">
                        <span className="play-icon">▶</span>
                      </button>
                    </div>
                    <div className="similar-song-info">
                      <h4 className="similar-song-title">Similar Song {index + 1}</h4>
                      <p className="similar-song-artist">Various Artists</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mini Player */}
      {isPlaying && (
        <div className="mini-player">
          <div className="mini-player-content">
            <img src={song.cover} alt={song.title} className="mini-cover" />
            <div className="mini-info">
              <div className="mini-title">{song.title}</div>
              <div className="mini-artist">{song.artist}</div>
            </div>
            <div className="mini-controls">
              <button className="mini-control">⏮️</button>
              <button className="mini-control play-pause" onClick={handlePlayPause}>
                ⏸️
              </button>
              <button className="mini-control">⏭️</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicDetail;