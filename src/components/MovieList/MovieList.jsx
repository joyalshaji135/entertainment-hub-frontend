// components/MovieList/MovieList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './MovieList.css';

const MovieList = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleMovies, setVisibleMovies] = useState(12);
  const { isAuthenticated } = useAuth();

  const categories = [
    { id: 'all', label: 'All Movies', icon: '🎬' },
    { id: 'Action', label: 'Action', icon: '💥' },
    { id: 'Comedy', label: 'Comedy', icon: '😂' },
    { id: 'Drama', label: 'Drama', icon: '🎭' },
    { id: 'Crime', label: 'Crime', icon: '🔫' },
    { id: 'Biography', label: 'Biography', icon: '📖' },
    { id: 'History', label: 'History', icon: '🏛️' },
    { id: 'Adventure', label: 'Adventure', icon: '🗺️' },
  ];

  const sortOptions = [
    { id: 'popular', label: 'Most Popular' },
    { id: 'rating', label: 'Highest Rated' },
    { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' },
    { id: 'rank', label: 'Top Ranked' },
  ];

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://imdb-top-100-movies.p.rapidapi.com/', {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'imdb-top-100-movies.p.rapidapi.com',
          'x-rapidapi-key': '042319157cmsh7c7ddfec2a8370bp186c32jsn0fb395b37716'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      setMovies(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterMoviesByGenre = (movies, genre) => {
    if (genre === 'all') return movies;
    return movies.filter(movie => 
      movie.genre && movie.genre.includes(genre)
    );
  };

  const sortMovies = (movies, sortType) => {
    const sorted = [...movies];
    switch(sortType) {
      case 'rating':
        return sorted.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      case 'newest':
        return sorted.sort((a, b) => b.year - a.year);
      case 'oldest':
        return sorted.sort((a, b) => a.year - b.year);
      case 'rank':
        return sorted.sort((a, b) => a.rank - b.rank);
      case 'popular':
      default:
        return sorted; // Keep original order (IMDb rank)
    }
  };

  const filteredMovies = filterMoviesByGenre(movies, selectedCategory);
  const sortedMovies = sortMovies(filteredMovies, sortBy);
  const displayedMovies = sortedMovies.slice(0, visibleMovies);

  const handleLoadMore = () => {
    setVisibleMovies(prev => prev + 12);
  };

  const handleAddToWatchlist = (movie, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // You can show a login prompt or redirect
      alert('Please login to add movies to watchlist');
      return;
    }

    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    
    // Check if movie is already in watchlist
    const isInWatchlist = watchlist.some(item => item.id === movie.id);
    
    if (isInWatchlist) {
      // Remove from watchlist
      const updatedWatchlist = watchlist.filter(item => item.id !== movie.id);
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      alert('Removed from watchlist');
    } else {
      // Add to watchlist
      watchlist.push({
        id: movie.id,
        title: movie.title,
        image: movie.image,
        rating: movie.rating,
        year: movie.year,
        rank: movie.rank
      });
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      alert('Added to watchlist');
    }
  };

  const checkInWatchlist = (movieId) => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    return watchlist.some(item => item.id === movieId);
  };

  if (loading) {
    return (
      <div className="movie-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading amazing movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-list-error">
        <div className="error-icon">🎬</div>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button onClick={fetchMovies} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="movie-list-container">
      <div className="list-header">
        <div className="header-content">
          <h2 className="list-title">Browse Movies</h2>
          <p className="list-subtitle">
            Discover {movies.length} amazing movies from our collection
          </p>
        </div>
        
        <div className="list-controls">
          <div className="sort-control">
            <label htmlFor="sort-select">Sort by:</label>
            <select 
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-label">{category.label}</span>
            {selectedCategory === category.id && (
              <span className="category-count">
                ({filterMoviesByGenre(movies, category.id).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="movies-grid">
        {displayedMovies.map((movie, index) => (
          <Link 
            to={`/movie/${movie.id}`} 
            key={movie.id} 
            className="movie-card-link"
            style={{ '--animation-order': index }}
          >
            <div className="movie-card">
              <div className="movie-card-inner">
                <div className="movie-image">
                  <img 
                    src={movie.image} 
                    alt={movie.title}
                    loading="lazy"
                  />
                  <div className="image-overlay">
                    <button className="play-overlay-btn">
                      <span className="play-icon">▶</span>
                    </button>
                  </div>
                  
                  {movie.rank <= 10 && (
                    <div className="top-badge">TOP {movie.rank}</div>
                  )}
                  
                  {movie.year >= 2023 && (
                    <div className="new-badge">NEW</div>
                  )}
                </div>
                
                <div className="movie-info">
                  <div className="movie-header">
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-year">{movie.year}</div>
                  </div>
                  
                  <div className="movie-meta">
                    <div className="movie-rating">
                      <span className="star">⭐</span>
                      <span className="rating-value">{movie.rating}</span>
                    </div>
                    <div className="movie-rank">#{movie.rank}</div>
                  </div>
                  
                  <div className="movie-genres">
                    {movie.genre && movie.genre.slice(0, 3).map((genre, index) => (
                      <span key={index} className="genre-tag">{genre}</span>
                    ))}
                  </div>
                  
                  <p className="movie-description">
                    {movie.description && movie.description.length > 100
                      ? `${movie.description.substring(0, 100)}...`
                      : movie.description}
                  </p>
                  
                  <div className="movie-actions">
                    <button 
                      className="watch-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle watch now
                      }}
                    >
                      <span className="btn-icon">▶</span>
                      Watch Now
                    </button>
                    <button 
                      className={`watchlist-btn ${checkInWatchlist(movie.id) ? 'in-watchlist' : ''}`}
                      onClick={(e) => handleAddToWatchlist(movie, e)}
                    >
                      <span className="btn-icon">
                        {checkInWatchlist(movie.id) ? '✓' : '+'}
                      </span>
                      {checkInWatchlist(movie.id) ? 'In List' : 'Watchlist'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {visibleMovies < filteredMovies.length && (
        <div className="load-more">
          <button onClick={handleLoadMore} className="load-more-btn">
            Load More Movies
            <span className="load-icon">↓</span>
          </button>
          <p className="load-more-info">
            Showing {displayedMovies.length} of {filteredMovies.length} movies
          </p>
        </div>
      )}
    </div>
  );
};

export default MovieList;