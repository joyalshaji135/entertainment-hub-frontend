import React, { useState, useEffect, useRef } from 'react';
import MusicPlayer from '../../components/MusicPlayer/MusicPlayer';
import AlbumCard from '../../components/AlbumCard/AlbumCard';
import ArtistCard from '../../components/ArtistCard/ArtistCard';
import PlaylistCard from '../../components/PlaylistCard/PlaylistCard';
import './MusicPage.css';

const MusicPage = () => {
  const [activeTab, setActiveTab] = useState('featured');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  // Sample music data
  const featuredTracks = [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: "3:22",
      genre: ["Pop", "R&B"],
      year: 2020,
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      audioUrl: "https://example.com/track1.mp3",
      isFavorite: true,
      plays: "2.5B",
      explicit: true
    },
    {
      id: 2,
      title: "Bad Guy",
      artist: "Billie Eilish",
      album: "When We All Fall Asleep, Where Do We Go?",
      duration: "3:14",
      genre: ["Pop", "Electro-pop"],
      year: 2019,
      cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
      audioUrl: "https://example.com/track2.mp3",
      isFavorite: false,
      plays: "1.8B",
      explicit: true
    },
    {
      id: 3,
      title: "Stay",
      artist: "The Kid LAROI, Justin Bieber",
      album: "F*CK LOVE 3",
      duration: "2:21",
      genre: ["Pop", "Hip Hop"],
      year: 2021,
      cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400",
      audioUrl: "https://example.com/track3.mp3",
      isFavorite: true,
      plays: "1.2B",
      explicit: true
    },
    {
      id: 4,
      title: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      duration: "3:23",
      genre: ["Pop", "Disco"],
      year: 2020,
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      audioUrl: "https://example.com/track4.mp3",
      isFavorite: false,
      plays: "1.5B",
      explicit: false
    }
  ];

  const albums = [
    {
      id: 1,
      title: "Midnights",
      artist: "Taylor Swift",
      year: 2022,
      genre: ["Pop"],
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w-400",
      tracks: 13,
      duration: "44:02",
      isExplicit: true,
      type: "Album"
    },
    {
      id: 2,
      title: "Dawn FM",
      artist: "The Weeknd",
      year: 2022,
      genre: ["R&B", "Pop"],
      cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w-400",
      tracks: 16,
      duration: "51:49",
      isExplicit: true,
      type: "Album"
    },
    {
      id: 3,
      title: "30",
      artist: "Adele",
      year: 2021,
      genre: ["Pop", "Soul"],
      cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w-400",
      tracks: 12,
      duration: "58:15",
      isExplicit: false,
      type: "Album"
    },
    {
      id: 4,
      title: "UNIVERSE",
      artist: "NCT",
      year: 2021,
      genre: ["K-Pop", "Pop"],
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w-400",
      tracks: 10,
      duration: "32:45",
      isExplicit: false,
      type: "EP"
    },
    {
      id: 5,
      title: "Happier Than Ever",
      artist: "Billie Eilish",
      year: 2021,
      genre: ["Pop", "Alternative"],
      cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w-400",
      tracks: 16,
      duration: "56:07",
      isExplicit: true,
      type: "Album"
    },
    {
      id: 6,
      title: "Justice",
      artist: "Justin Bieber",
      year: 2021,
      genre: ["Pop", "R&B"],
      cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w-400",
      tracks: 16,
      duration: "45:25",
      isExplicit: true,
      type: "Album"
    }
  ];

  const artists = [
    {
      id: 1,
      name: "Taylor Swift",
      genre: ["Pop", "Country"],
      followers: "52M",
      albums: 10,
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      isVerified: true
    },
    {
      id: 2,
      name: "The Weeknd",
      genre: ["R&B", "Pop"],
      followers: "45M",
      albums: 5,
      cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
      isVerified: true
    },
    {
      id: 3,
      name: "Drake",
      genre: ["Hip Hop", "R&B"],
      followers: "68M",
      albums: 7,
      cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400",
      isVerified: true
    },
    {
      id: 4,
      name: "Ariana Grande",
      genre: ["Pop", "R&B"],
      followers: "48M",
      albums: 6,
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      isVerified: true
    },
    {
      id: 5,
      name: "BTS",
      genre: ["K-Pop", "Pop"],
      followers: "72M",
      albums: 8,
      cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
      isVerified: true
    },
    {
      id: 6,
      name: "Ed Sheeran",
      genre: ["Pop", "Folk"],
      followers: "55M",
      albums: 5,
      cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400",
      isVerified: true
    }
  ];

  const playlists = [
    {
      id: 1,
      title: "Today's Top Hits",
      creator: "EntertainHub",
      tracks: 50,
      duration: "2h 30m",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      genre: ["Pop", "Hip Hop"],
      followers: "35M",
      isPublic: true
    },
    {
      id: 2,
      title: "Chill Vibes",
      creator: "EntertainHub",
      tracks: 40,
      duration: "2h 15m",
      cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
      genre: ["Lo-fi", "Chill"],
      followers: "18M",
      isPublic: true
    },
    {
      id: 3,
      title: "Workout Energy",
      creator: "EntertainHub",
      tracks: 30,
      duration: "1h 45m",
      cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400",
      genre: ["EDM", "Hip Hop"],
      followers: "22M",
      isPublic: true
    },
    {
      id: 4,
      title: "Indie Mix",
      creator: "EntertainHub",
      tracks: 35,
      duration: "2h 10m",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      genre: ["Indie", "Alternative"],
      followers: "12M",
      isPublic: true
    }
  ];

  const genres = [
    { name: 'Pop', color: '#ff6b6b', icon: '🎤' },
    { name: 'Hip Hop', color: '#4ecdc4', icon: '🎧' },
    { name: 'Rock', color: '#ffd166', icon: '🎸' },
    { name: 'R&B', color: '#06d6a0', icon: '🎹' },
    { name: 'Electronic', color: '#118ab2', icon: '🎛️' },
    { name: 'Jazz', color: '#ef476f', icon: '🎷' },
    { name: 'Country', color: '#ff9a3c', icon: '🎻' },
    { name: 'K-Pop', color: '#9d4edd', icon: '💃' },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handlePlayTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // In a real app, this would play the actual audio
    console.log('Playing:', track.title);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (currentTrack) {
      console.log(isPlaying ? 'Paused' : 'Playing', currentTrack.title);
    }
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre === selectedGenre ? 'all' : genre);
  };

  const tabs = [
    { id: 'featured', label: 'Featured', icon: '⭐' },
    { id: 'albums', label: 'Albums', icon: '💿' },
    { id: 'artists', label: 'Artists', icon: '🎤' },
    { id: 'playlists', label: 'Playlists', icon: '📜' },
    { id: 'genres', label: 'Genres', icon: '🎵' },
  ];

  const filteredData = () => {
    let data = [];
    
    switch(activeTab) {
      case 'featured':
        data = featuredTracks;
        break;
      case 'albums':
        data = albums;
        break;
      case 'artists':
        data = artists;
        break;
      case 'playlists':
        data = playlists;
        break;
      default:
        data = [];
    }

    if (selectedGenre !== 'all') {
      data = data.filter(item => 
        item.genre && item.genre.includes(selectedGenre)
      );
    }

    if (searchQuery) {
      data = data.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return data;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading music library...</p>
      </div>
    );
  }

  return (
    <div className="music-page">
      {/* Hero Banner */}
      <div className="music-hero">
        <div className="hero-content">
          <h1 className="hero-title">Stream Unlimited Music</h1>
          <p className="hero-subtitle">
            Discover new music, create playlists, and listen to your favorite artists
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">70M+</div>
              <div className="stat-label">Songs</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">8M+</div>
              <div className="stat-label">Artists</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Playlists</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visualizer">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="visualizer-bar"
                style={{
                  animationDelay: `${i * 0.05}s`,
                  height: `${20 + Math.random() * 60}%`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="music-container">
        {/* Search and Tabs */}
        <div className="music-header">
          <div className="search-container">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search songs, artists, albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="music-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Genre Filters */}
        <div className="genre-filters">
          <h3 className="filters-title">Browse by Genre</h3>
          <div className="genre-grid">
            {genres.map(genre => (
              <button
                key={genre.name}
                className={`genre-chip ${selectedGenre === genre.name.toLowerCase() ? 'active' : ''}`}
                onClick={() => handleGenreSelect(genre.name.toLowerCase())}
                style={{ '--genre-color': genre.color }}
              >
                <span className="genre-icon">{genre.icon}</span>
                <span className="genre-name">{genre.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Tracks */}
        {activeTab === 'featured' && (
          <div className="featured-section">
            <h2 className="section-title">Featured Tracks</h2>
            <div className="tracks-grid">
              {filteredData().map(track => (
                <div key={track.id} className="track-card">
                  <div className="track-image">
                    <img src={track.cover} alt={track.title} />
                    <button 
                      className="play-track-btn"
                      onClick={() => handlePlayTrack(track)}
                    >
                      <span className="play-icon">▶</span>
                    </button>
                  </div>
                  <div className="track-info">
                    <h4 className="track-title">{track.title}</h4>
                    <p className="track-artist">{track.artist}</p>
                    <div className="track-meta">
                      <span className="meta-item">{track.album}</span>
                      <span className="meta-item">•</span>
                      <span className="meta-item">{track.year}</span>
                      {track.explicit && <span className="explicit-badge">E</span>}
                    </div>
                    <div className="track-stats">
                      <span className="stat">⭐ {track.plays} plays</span>
                      <button className="favorite-btn">
                        {track.isFavorite ? '❤️' : '🤍'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Albums Grid */}
        {activeTab === 'albums' && (
          <div className="albums-section">
            <h2 className="section-title">New Releases</h2>
            <div className="cards-grid">
              {filteredData().map(album => (
                <AlbumCard key={album.id} album={album} onPlay={() => handlePlayTrack(album)} />
              ))}
            </div>
          </div>
        )}

        {/* Artists Grid */}
        {activeTab === 'artists' && (
          <div className="artists-section">
            <h2 className="section-title">Popular Artists</h2>
            <div className="cards-grid">
              {filteredData().map(artist => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </div>
        )}

        {/* Playlists Grid */}
        {activeTab === 'playlists' && (
          <div className="playlists-section">
            <h2 className="section-title">Curated Playlists</h2>
            <div className="cards-grid">
              {filteredData().map(playlist => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          </div>
        )}

        {/* Genres Grid */}
        {activeTab === 'genres' && (
          <div className="genres-section">
            <h2 className="section-title">Music Genres</h2>
            <div className="genres-grid-large">
              {genres.map(genre => (
                <div 
                  key={genre.name}
                  className="genre-card-large"
                  style={{ background: `linear-gradient(45deg, ${genre.color}, ${genre.color}dd)` }}
                >
                  <div className="genre-content">
                    <span className="genre-icon-large">{genre.icon}</span>
                    <h3 className="genre-name-large">{genre.name}</h3>
                    <p className="genre-desc">Explore the best of {genre.name}</p>
                    <button className="genre-explore-btn">Explore →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Now Playing Section */}
        {currentTrack && (
          <div className="now-playing-section">
            <h2 className="section-title">Now Playing</h2>
            <MusicPlayer
              track={currentTrack}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onNext={() => {
                const currentIndex = featuredTracks.findIndex(t => t.id === currentTrack.id);
                const nextTrack = featuredTracks[(currentIndex + 1) % featuredTracks.length];
                setCurrentTrack(nextTrack);
              }}
              onPrevious={() => {
                const currentIndex = featuredTracks.findIndex(t => t.id === currentTrack.id);
                const prevTrack = featuredTracks[(currentIndex - 1 + featuredTracks.length) % featuredTracks.length];
                setCurrentTrack(prevTrack);
              }}
            />
          </div>
        )}

        {/* Recommendations */}
        <div className="recommendations-section">
          <h2 className="section-title">Recommended For You</h2>
          <div className="recommendations-grid">
            {featuredTracks.slice(0, 4).map(track => (
              <div key={track.id} className="recommendation-card">
                <img src={track.cover} alt={track.title} className="rec-image" />
                <div className="rec-info">
                  <h4 className="rec-title">{track.title}</h4>
                  <p className="rec-artist">{track.artist}</p>
                  <button 
                    className="rec-play-btn"
                    onClick={() => handlePlayTrack(track)}
                  >
                    ▶ Play
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;