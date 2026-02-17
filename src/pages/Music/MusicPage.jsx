// pages/Music/MusicPage.jsx
import React, { useState, useEffect, useRef } from "react";
import "./MusicPage.css";
import { Link } from "react-router-dom";

const MusicPage = () => {
  const [activeTab, setActiveTab] = useState("featured");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const audioRef = useRef(null);

  // Sample data for other sections (albums, artists, playlists)
  const albums = [
    {
      id: 1,
      title: "After Hours",
      artist: "The Weeknd",
      year: 2020,
      genre: ["Pop", "R&B"],
      cover:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      tracks: 14,
      duration: "56:19",
      isExplicit: true,
      type: "Album",
    },
    {
      id: 2,
      title: "Future Nostalgia",
      artist: "Dua Lipa",
      year: 2020,
      genre: ["Pop", "Disco"],
      cover:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
      tracks: 11,
      duration: "37:17",
      isExplicit: false,
      type: "Album",
    },
    {
      id: 3,
      title: "Happier Than Ever",
      artist: "Billie Eilish",
      year: 2021,
      genre: ["Pop", "Alternative"],
      cover:
        "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400",
      tracks: 16,
      duration: "56:07",
      isExplicit: true,
      type: "Album",
    },
    {
      id: 4,
      title: "Dawn FM",
      artist: "The Weeknd",
      year: 2022,
      genre: ["R&B", "Pop"],
      cover:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      tracks: 16,
      duration: "51:49",
      isExplicit: true,
      type: "Album",
    },
  ];

  const artists = [
    {
      id: 1,
      name: "The Weeknd",
      genre: ["R&B", "Pop"],
      followers: "45M",
      albums: 5,
      cover:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      isVerified: true,
    },
    {
      id: 2,
      name: "Billie Eilish",
      genre: ["Pop", "Alternative"],
      followers: "38M",
      albums: 2,
      cover:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
      isVerified: true,
    },
    {
      id: 3,
      name: "Dua Lipa",
      genre: ["Pop", "Dance"],
      followers: "32M",
      albums: 2,
      cover:
        "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400",
      isVerified: true,
    },
  ];

  const playlists = [
    {
      id: 1,
      title: "Today's Top Hits",
      creator: "EntertainHub",
      tracks: 50,
      duration: "2h 30m",
      cover:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      genre: ["Pop", "Hip Hop"],
      followers: "35M",
      isPublic: true,
    },
    {
      id: 2,
      title: "Chill Vibes",
      creator: "EntertainHub",
      tracks: 40,
      duration: "2h 15m",
      cover:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
      genre: ["Lo-fi", "Chill"],
      followers: "18M",
      isPublic: true,
    },
    {
      id: 3,
      title: "Workout Energy",
      creator: "EntertainHub",
      tracks: 30,
      duration: "1h 45m",
      cover:
        "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400",
      genre: ["EDM", "Hip Hop"],
      followers: "22M",
      isPublic: true,
    },
  ];

  const genres = [
    { name: "Pop", color: "#ff6b6b", icon: "🎤" },
    { name: "Hip Hop", color: "#4ecdc4", icon: "🎧" },
    { name: "R&B", color: "#06d6a0", icon: "🎹" },
    { name: "Rock", color: "#ffd166", icon: "🎸" },
    { name: "Electronic", color: "#118ab2", icon: "🎛️" },
    { name: "Alternative", color: "#9d4edd", icon: "🎸" },
  ];

  const tabs = [
    { id: "featured", label: "Songs", icon: "🎵" },
    { id: "albums", label: "Albums", icon: "💿" },
    { id: "artists", label: "Artists", icon: "🎤" },
    { id: "playlists", label: "Playlists", icon: "📜" },
    { id: "genres", label: "Genres", icon: "🎵" },
  ];

  // Fetch songs from Genius API
  useEffect(() => {
    if (activeTab === "featured") {
      fetchSongs();
    }
  }, [activeTab, page, searchQuery]);

  const fetchSongs = async () => {
    setLoading(true);
    setError(null);

    try {
      const query = searchQuery || "popular";
      const response = await fetch(
        `https://genius-song-lyrics1.p.rapidapi.com/search/?q=${encodeURIComponent(query)}&per_page=20&page=${page}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "genius-song-lyrics1.p.rapidapi.com",
            "x-rapidapi-key":
              "042319157cmsh7c7ddfec2a8370bp186c32jsn0fb395b37716",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch songs");
      }

      const data = await response.json();

      if (data.hits && data.hits.length > 0) {
        const formattedSongs = data.hits.map((hit, index) => {
          const song = hit.result;
          return {
            id: song.id || `song-${index}`,
            title: song.title,
            artist: song.artist_names || song.primary_artist?.name,
            album: song.album?.name || "Single",
            cover:
              song.song_art_image_url ||
              song.header_image_url ||
              "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
            year:
              song.release_date_components?.year || new Date().getFullYear(),
            genre: extractGenre(song),
            plays: formatPageViews(song.stats?.pageviews),
            explicit: checkExplicit(song),
            url: song.url,
            api_path: song.api_path,
          };
        });

        if (page === 1) {
          setSongs(formattedSongs);
        } else {
          setSongs((prev) => [...prev, ...formattedSongs]);
        }

        setHasMore(data.hits.length === 20);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching songs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const extractGenre = (song) => {
    // Genius API doesn't provide genre directly, so we'll infer from tags or return default
    const defaultGenres = ["Pop", "Hip Hop", "R&B", "Rock"];
    return [defaultGenres[Math.floor(Math.random() * defaultGenres.length)]];
  };

  const formatPageViews = (views) => {
    if (!views) return "0";
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const checkExplicit = (song) => {
    // Check if song title or artist name contains explicit indicators
    const explicitKeywords = ["explicit", "dirty", "uncensored"];
    const titleLower = song.title?.toLowerCase() || "";
    const artistLower = song.artist_names?.toLowerCase() || "";
    return explicitKeywords.some(
      (keyword) =>
        titleLower.includes(keyword) || artistLower.includes(keyword),
    );
  };

  const handlePlayTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // In a real app, you would fetch the actual audio URL
    console.log("Playing:", track.title);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (currentTrack) {
      console.log(isPlaying ? "Paused" : "Playing", currentTrack.title);
    }
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre === selectedGenre ? "all" : genre);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const filteredData = () => {
    let data = [];

    switch (activeTab) {
      case "featured":
        data = songs;
        break;
      case "albums":
        data = albums;
        break;
      case "artists":
        data = artists;
        break;
      case "playlists":
        data = playlists;
        break;
      default:
        data = [];
    }

    if (selectedGenre !== "all") {
      data = data.filter(
        (item) =>
          item.genre &&
          item.genre.some((g) =>
            g.toLowerCase().includes(selectedGenre.toLowerCase()),
          ),
      );
    }

    return data;
  };

  return (
    <div className="music-page">
      {/* Hero Banner */}
      <div className="music-hero">
        <div className="hero-content">
          <h1 className="hero-title">Stream Unlimited Music</h1>
          <p className="hero-subtitle">
            Discover new music, create playlists, and listen to your favorite
            artists
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
                  height: `${20 + Math.random() * 60}%`,
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
                onChange={handleSearch}
                className="search-input"
              />
              {searchQuery && (
                <button
                  className="clear-search"
                  onClick={() => {
                    setSearchQuery("");
                    setPage(1);
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="music-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPage(1);
                }}
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
            {genres.map((genre) => (
              <button
                key={genre.name}
                className={`genre-chip ${selectedGenre === genre.name.toLowerCase() ? "active" : ""}`}
                onClick={() => handleGenreSelect(genre.name.toLowerCase())}
                style={{ "--genre-color": genre.color }}
              >
                <span className="genre-icon">{genre.icon}</span>
                <span className="genre-name">{genre.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button onClick={() => fetchSongs()} className="retry-btn">
              Try Again
            </button>
          </div>
        )}

        {/* Songs Section */}
        {activeTab === "featured" && (
          <div className="featured-section">
            <h2 className="section-title">
              {searchQuery
                ? `Search Results: "${searchQuery}"`
                : "Popular Songs"}
            </h2>

            {loading && page === 1 ? (
              <div className="loading-grid">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-title"></div>
                    <div className="skeleton-artist"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="tracks-grid">
                  {filteredData().map((track) => (
                    <Link to={`/music/${track.id}`} className="track-card-link">
                      <div key={track.id} className="track-card">
                        <div className="track-image">
                          <img
                            src={track.cover}
                            alt={track.title}
                            loading="lazy"
                          />
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
                            {track.explicit && (
                              <span className="explicit-badge">E</span>
                            )}
                          </div>
                          <div className="track-stats">
                            <span className="stat">⭐ {track.plays} plays</span>
                            <a
                              href={track.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="lyrics-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              📝 Lyrics
                            </a>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="load-more-container">
                    <button
                      className="load-more-btn"
                      onClick={handleLoadMore}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="loading-spinner-small"></span>
                          Loading...
                        </>
                      ) : (
                        "Load More Songs"
                      )}
                    </button>
                  </div>
                )}

                {!hasMore && songs.length > 0 && (
                  <p className="no-more">No more songs to load</p>
                )}

                {songs.length === 0 && !loading && (
                  <div className="no-results">
                    <div className="no-results-icon">🎵</div>
                    <h3>No songs found</h3>
                    <p>Try a different search term</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Albums Grid */}
        {activeTab === "albums" && (
          <div className="albums-section">
            <h2 className="section-title">Popular Albums</h2>
            <div className="cards-grid">
              {filteredData().map((album) => (
                <div key={album.id} className="album-card">
                  <div className="album-image">
                    <img src={album.cover} alt={album.title} />
                    <button className="play-album-btn">
                      <span className="play-icon">▶</span>
                    </button>
                  </div>
                  <div className="album-info">
                    <h4 className="album-title">{album.title}</h4>
                    <p className="album-artist">{album.artist}</p>
                    <div className="album-meta">
                      <span>{album.year}</span>
                      <span>•</span>
                      <span>{album.tracks} tracks</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Artists Grid */}
        {activeTab === "artists" && (
          <div className="artists-section">
            <h2 className="section-title">Popular Artists</h2>
            <div className="cards-grid">
              {filteredData().map((artist) => (
                <div key={artist.id} className="artist-card">
                  <div className="artist-image">
                    <img src={artist.cover} alt={artist.name} />
                    {artist.isVerified && (
                      <span className="verified-badge" title="Verified Artist">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="artist-info">
                    <h4 className="artist-name">{artist.name}</h4>
                    <p className="artist-genre">{artist.genre.join(", ")}</p>
                    <div className="artist-meta">
                      <span>⭐ {artist.followers} followers</span>
                      <span>•</span>
                      <span>{artist.albums} albums</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Playlists Grid */}
        {activeTab === "playlists" && (
          <div className="playlists-section">
            <h2 className="section-title">Curated Playlists</h2>
            <div className="cards-grid">
              {filteredData().map((playlist) => (
                <div key={playlist.id} className="playlist-card">
                  <div className="playlist-image">
                    <img src={playlist.cover} alt={playlist.title} />
                    <div className="playlist-overlay">
                      <span className="playlist-count">
                        {playlist.tracks} tracks
                      </span>
                    </div>
                  </div>
                  <div className="playlist-info">
                    <h4 className="playlist-title">{playlist.title}</h4>
                    <p className="playlist-creator">by {playlist.creator}</p>
                    <div className="playlist-meta">
                      <span>⭐ {playlist.followers}</span>
                      <span>•</span>
                      <span>{playlist.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Genres Grid */}
        {activeTab === "genres" && (
          <div className="genres-section">
            <h2 className="section-title">Music Genres</h2>
            <div className="genres-grid-large">
              {genres.map((genre) => (
                <div
                  key={genre.name}
                  className="genre-card-large"
                  style={{
                    background: `linear-gradient(45deg, ${genre.color}, ${genre.color}dd)`,
                  }}
                  onClick={() => {
                    setActiveTab("featured");
                    setSelectedGenre(genre.name.toLowerCase());
                  }}
                >
                  <div className="genre-content">
                    <span className="genre-icon-large">{genre.icon}</span>
                    <h3 className="genre-name-large">{genre.name}</h3>
                    <p className="genre-desc">
                      Explore the best of {genre.name}
                    </p>
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
            <div className="music-player">
              <div className="player-track-info">
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  className="player-cover"
                />
                <div className="player-track-details">
                  <h3 className="player-title">{currentTrack.title}</h3>
                  <p className="player-artist">{currentTrack.artist}</p>
                </div>
              </div>
              <div className="player-controls">
                <button
                  className="control-btn"
                  onClick={() => {
                    // Previous track logic
                  }}
                >
                  ⏮️
                </button>
                <button
                  className="control-btn play-pause"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? "⏸️" : "▶️"}
                </button>
                <button
                  className="control-btn"
                  onClick={() => {
                    // Next track logic
                  }}
                >
                  ⏭️
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="recommendations-section">
          <h2 className="section-title">Recommended For You</h2>
          <div className="recommendations-grid">
            {songs.slice(0, 4).map((track) => (
              <div key={track.id} className="recommendation-card">
                <img
                  src={track.cover}
                  alt={track.title}
                  className="rec-image"
                />
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
