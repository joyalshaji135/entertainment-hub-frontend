// pages/Anime/AnimePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AnimePage.css';

const AnimePage = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [sortBy, setSortBy] = useState('ranking');
  const [sortOrder, setSortOrder] = useState('asc');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_HOST = 'anime-db.p.rapidapi.com';

  // Fetch genres on mount
  useEffect(() => {
    fetchGenres();
  }, []);

  // Fetch anime when filters change
  useEffect(() => {
    fetchAnime();
  }, [page, searchQuery, selectedGenre, sortBy, sortOrder, status, type]);

  const fetchGenres = async () => {
    try {
      const response = await fetch('https://anime-db.p.rapidapi.com/genre', {
        method: 'GET',
        headers: {
          'x-rapidapi-host': API_HOST,
          'x-rapidapi-key': API_KEY
        }
      });

      if (!response.ok) throw new Error('Failed to fetch genres');
      const data = await response.json();
      setGenres(data.map(g => g.id).sort());
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  };

  const fetchAnime = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      let url = `https://anime-db.p.rapidapi.com/anime?page=${page}&size=20`;
      
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      
      if (selectedGenre) {
        url += `&genres=${encodeURIComponent(selectedGenre)}`;
      }
      
      url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      
      if (status) {
        url += `&status=${encodeURIComponent(status)}`;
      }
      
      if (type) {
        url += `&type=${encodeURIComponent(type)}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': API_HOST,
          'x-rapidapi-key': API_KEY
        }
      });

      if (!response.ok) throw new Error('Failed to fetch anime');
      
      const data = await response.json();
      
      // Handle both array response and paginated response
      if (Array.isArray(data)) {
        setAnimeList(data);
        setTotalPages(1);
      } else if (data.data) {
        setAnimeList(data.data);
        setTotalPages(data.totalPages || Math.ceil(data.total / 20));
      } else {
        setAnimeList([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAnime();
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre === selectedGenre ? '' : genre);
    setPage(1);
  };

  const handleSortChange = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split('-');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const statusOptions = ['', 'Finished Airing', 'Currently Airing', 'Not yet aired'];
  const typeOptions = ['', 'TV', 'Movie', 'OVA', 'Special', 'ONA', 'Music'];

  if (loading && page === 1) {
    return (
      <div className="anime-loading">
        <div className="loading-spinner"></div>
        <p>Loading amazing anime...</p>
      </div>
    );
  }

  return (
    <div className="anime-page">
      {/* Hero Banner */}
      <div className="anime-hero">
        <div className="hero-content">
          <h1 className="hero-title">Discover Anime</h1>
          <p className="hero-subtitle">
            Explore thousands of anime series, movies, and specials
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="anime-filters">
        <div className="filters-container">
          {/* Search */}
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search anime by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              🔍 Search
            </button>
          </form>

          {/* Sort */}
          <div className="sort-control">
            <label>Sort by:</label>
            <select onChange={handleSortChange} value={`${sortBy}-${sortOrder}`}>
              <option value="ranking-asc">Rank (High to Low)</option>
              <option value="ranking-desc">Rank (Low to High)</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="episodes-desc">Episodes (Most)</option>
              <option value="episodes-asc">Episodes (Least)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="filter-control">
            <label>Status:</label>
            <select onChange={(e) => { setStatus(e.target.value); setPage(1); }} value={status}>
              {statusOptions.map(s => (
                <option key={s} value={s}>{s || 'All Status'}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="filter-control">
            <label>Type:</label>
            <select onChange={(e) => { setType(e.target.value); setPage(1); }} value={type}>
              {typeOptions.map(t => (
                <option key={t} value={t}>{t || 'All Types'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Genre Filters */}
        <div className="genre-filters">
          <h3>Genres</h3>
          <div className="genre-grid">
            {genres.map(genre => (
              <button
                key={genre}
                className={`genre-btn ${selectedGenre === genre ? 'active' : ''}`}
                onClick={() => handleGenreChange(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={fetchAnime} className="retry-btn">Try Again</button>
        </div>
      )}

      {/* Anime Grid */}
      <div className="anime-grid">
        {animeList.map((anime, index) => (
          <Link to={`/anime/${anime.id}`} key={anime.id} className="anime-card-link">
            <div className="anime-card" style={{ '--animation-order': index }}>
              <div className="anime-image">
                <img 
                  src={anime.image || anime.thumb} 
                  alt={anime.title}
                  loading="lazy"
                />
                <div className="image-overlay">
                  <span className="view-details">View Details</span>
                </div>
                {anime.ranking <= 10 && (
                  <div className="rank-badge">#{anime.ranking}</div>
                )}
              </div>
              <div className="anime-info">
                <h3 className="anime-title">{anime.title}</h3>
                <div className="anime-meta">
                  <span className="anime-type">{anime.type}</span>
                  <span className="anime-episodes">{anime.episodes} eps</span>
                </div>
                <div className="anime-genres">
                  {anime.genres?.slice(0, 3).map(g => (
                    <span key={g} className="genre-tag">{g}</span>
                  ))}
                </div>
                <div className="anime-status">
                  <span className={`status-badge ${anime.status?.toLowerCase().replace(' ', '-')}`}>
                    {anime.status}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Loading More Indicator */}
      {loading && page > 1 && (
        <div className="loading-more">
          <div className="loading-spinner-small"></div>
          <p>Loading more...</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Previous
          </button>
          
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          
          <button
            className="pagination-btn"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      )}

      {/* No Results */}
      {!loading && animeList.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">📺</div>
          <h3>No anime found</h3>
          <p>Try adjusting your filters or search terms</p>
          <button 
            className="clear-filters-btn"
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('');
              setStatus('');
              setType('');
              setSortBy('ranking');
              setSortOrder('asc');
              setPage(1);
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AnimePage;