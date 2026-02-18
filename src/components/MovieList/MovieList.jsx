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
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

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
    if (isAuthenticated && user) {
      fetchWishlist();
    }
  }, [isAuthenticated, user]);

  const API_KEY = import.meta.env.VITE_API_KEY;

  console.log('Using API Key:', API_KEY); // Debugging line to check if the API key is loaded correctly

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://imdb-top-100-movies.p.rapidapi.com/', {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'imdb-top-100-movies.p.rapidapi.com',
          'x-rapidapi-key': API_KEY
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

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:5000/wish-list/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'userId': user?._id || user?.id
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await response.json();
      
      // Handle different response structures
      if (data.data) {
        setWishlistItems(data.data);
      } else if (Array.isArray(data)) {
        setWishlistItems(data);
      } else {
        setWishlistItems([]);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  const addToWishlist = async (movie) => {
    if (!isAuthenticated || !user) {
      alert('Please login to add movies to wishlist');
      return false;
    }

    setWishlistLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:5000/wish-list/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user._id || user.id,
          sourceId: movie.id,
          sourceType: 'movie',
          title: movie.title,
          image: movie.image,
          rating: movie.rating,
          year: movie.year,
          rank: movie.rank,
          genre: movie.genre
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to wishlist');
      }

      if (data.status === 'success') {
        // Refresh wishlist
        await fetchWishlist();
        alert('Added to wishlist successfully!');
        return true;
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      alert(err.message || 'Failed to add to wishlist');
      return false;
    } finally {
      setWishlistLoading(false);
    }
  };

  const removeFromWishlist = async (movieId) => {
    if (!isAuthenticated || !user) {
      alert('Please login to manage wishlist');
      return false;
    }

    setWishlistLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      
      // Find the wishlist item ID
      const wishlistItem = wishlistItems.find(item => item.sourceId === movieId);
      
      if (!wishlistItem) {
        throw new Error('Item not found in wishlist');
      }

      const response = await fetch(`http://localhost:5000/wish-list/remove/${wishlistItem._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'userId': user._id || user.id
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove from wishlist');
      }

      if (data.status === 'success') {
        // Refresh wishlist
        await fetchWishlist();
        alert('Removed from wishlist successfully!');
        return true;
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert(err.message || 'Failed to remove from wishlist');
      return false;
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleWishlistToggle = async (movie, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isInWishlist = checkInWishlist(movie.id);
    
    if (isInWishlist) {
      await removeFromWishlist(movie.id);
    } else {
      await addToWishlist(movie);
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
        return sorted;
    }
  };

  const checkInWishlist = (movieId) => {
    return wishlistItems.some(item => item.sourceId === movieId);
  };

  const filteredMovies = filterMoviesByGenre(movies, selectedCategory);
  const sortedMovies = sortMovies(filteredMovies, sortBy);
  const displayedMovies = sortedMovies.slice(0, visibleMovies);

  const handleLoadMore = () => {
    setVisibleMovies(prev => prev + 12);
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
                      className={`wishlist-btn ${checkInWishlist(movie.id) ? 'in-wishlist' : ''}`}
                      onClick={(e) => handleWishlistToggle(movie, e)}
                      disabled={wishlistLoading}
                    >
                      <span className="btn-icon">
                        {checkInWishlist(movie.id) ? '❤️' : '🤍'}
                      </span>
                      {wishlistLoading ? 'Processing...' : (checkInWishlist(movie.id) ? 'In Wishlist' : 'Add to Wishlist')}
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