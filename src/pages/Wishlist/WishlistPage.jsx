// pages/WishList/WishListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './WishListPage.css';

const WishListPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [movieDetails, setMovieDetails] = useState({});
  const [loadingMovies, setLoadingMovies] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const API_KEY = import.meta.env.VITE_API_KEY;

  // Fetch wishlist on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchWishlist();
    }
  }, [isAuthenticated, navigate, user]);

  // Fetch movie details when wishlist updates
  useEffect(() => {
    if (wishlist.length > 0) {
      fetchMovieDetails();
    }
  }, [wishlist]);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      const userId = user?._id || user?.id;
      
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await fetch(`http://localhost:5000/wish-list/get/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        // Process wishlist items
        const processedItems = data.data.map(item => ({
          _id: item._id,
          userId: item.userId,
          sourceId: item.sourceId || item.movieId, // Handle both field names
          type: item.sourceId ? 'series' : 'movie', // Determine type based on field
          addedAt: item.createdAt || new Date().toISOString()
        }));
        
        setWishlist(processedItems);
      } else {
        setWishlist([]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetails = async () => {
    setLoadingMovies(true);
    
    try {
      const movieIds = wishlist
        .filter(item => item.type === 'movie')
        .map(item => item.sourceId);
      
      const seriesIds = wishlist
        .filter(item => item.type === 'series')
        .map(item => item.sourceId);

      // Fetch movie details
      const moviePromises = movieIds.map(async (id) => {
        try {
          const response = await fetch(`https://imdb-top-100-movies.p.rapidapi.com/${id}`, {
            method: 'GET',
            headers: {
              'x-rapidapi-host': 'imdb-top-100-movies.p.rapidapi.com',
              'x-rapidapi-key': API_KEY
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            return { id, data };
          }
        } catch (err) {
          console.error(`Error fetching movie ${id}:`, err);
        }
        return null;
      });

      // Fetch series details
      const seriesPromises = seriesIds.map(async (id) => {
        try {
          const response = await fetch(`https://imdb-top-100-movies.p.rapidapi.com/series/${id}`, {
            method: 'GET',
            headers: {
              'x-rapidapi-host': 'imdb-top-100-movies.p.rapidapi.com',
              'x-rapidapi-key': API_KEY
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            return { id, data };
          }
        } catch (err) {
          console.error(`Error fetching series ${id}:`, err);
        }
        return null;
      });

      const [movieResults, seriesResults] = await Promise.all([
        Promise.all(moviePromises),
        Promise.all(seriesPromises)
      ]);

      const details = {};
      
      movieResults.forEach(result => {
        if (result) {
          details[result.id] = { ...result.data, type: 'movie' };
        }
      });

      seriesResults.forEach(result => {
        if (result) {
          details[result.id] = { ...result.data, type: 'series' };
        }
      });

      setMovieDetails(details);
    } catch (err) {
      console.error('Error fetching details:', err);
    } finally {
      setLoadingMovies(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`http://localhost:5000/wish-list/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'userId': user?._id || user?.id
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove item');
      }

      if (data.status === 'success') {
        // Update local state
        setWishlist(prev => prev.filter(item => item._id !== itemId));
        setSelectedItems(prev => prev.filter(id => id !== itemId));
        
        showNotification('Item removed from wishlist', 'success');
      }
    } catch (err) {
      console.error('Error removing item:', err);
      showNotification(err.message || 'Failed to remove item', 'error');
    }
  };

  const handleRemoveSelected = async () => {
    if (selectedItems.length === 0) return;
    
    if (window.confirm(`Remove ${selectedItems.length} item(s) from wishlist?`)) {
      try {
        const token = localStorage.getItem('authToken');
        
        // Remove items one by one
        for (const itemId of selectedItems) {
          await fetch(`http://localhost:5000/wish-list/remove/${itemId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'userId': user?._id || user?.id
            }
          });
        }

        // Update local state
        setWishlist(prev => prev.filter(item => !selectedItems.includes(item._id)));
        setSelectedItems([]);
        
        showNotification('Selected items removed from wishlist', 'success');
      } catch (err) {
        console.error('Error removing items:', err);
        showNotification('Failed to remove some items', 'error');
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === wishlist.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlist.map(item => item._id));
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleShareWishlist = () => {
    const wishlistData = {
      items: wishlist.map(item => {
        const details = movieDetails[item.sourceId];
        return {
          title: details?.title || 'Unknown',
          type: item.type,
          id: item.sourceId
        };
      }),
      count: wishlist.length
    };

    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist',
        text: `Check out my wishlist with ${wishlist.length} items!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(JSON.stringify(wishlistData, null, 2));
      showNotification('Wishlist data copied to clipboard!', 'success');
    }
  };

  const showNotification = (message, type = 'success') => {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.innerHTML = `
      <span class="message-icon">${type === 'success' ? '✅' : '❌'}</span>
      <span class="message-text">${message}</span>
    `;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 3000);
  };

  // Filter and sort wishlist
  const getFilteredAndSortedWishlist = () => {
    let filtered = [...wishlist];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.addedAt || 0) - new Date(b.addedAt || 0));
        break;
      case 'name':
        filtered.sort((a, b) => {
          const nameA = movieDetails[a.sourceId]?.title || '';
          const nameB = movieDetails[b.sourceId]?.title || '';
          return nameA.localeCompare(nameB);
        });
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredWishlist = getFilteredAndSortedWishlist();

  // Get unique types for filter
  const itemTypes = ['all', ...new Set(wishlist.map(item => item.type))];

  if (loading) {
    return (
      <div className="wishlist-loading">
        <div className="loading-spinner-large"></div>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-error">
        <div className="error-icon">❤️</div>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={fetchWishlist} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      {/* Hero Banner */}
      <div className="wishlist-hero">
        <div className="hero-content">
          <h1 className="hero-title">My Wishlist</h1>
          <p className="hero-subtitle">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
      </div>

      <div className="wishlist-container">
        {/* Header with actions */}
        <div className="wishlist-header">
          <div className="header-left">
            <h2 className="section-title">Saved Items</h2>
            {wishlist.length > 0 && (
              <span className="item-count">{filteredWishlist.length} items</span>
            )}
          </div>

          <div className="header-right">
            <button 
              className="share-btn"
              onClick={handleShareWishlist}
              disabled={wishlist.length === 0}
            >
              <span className="btn-icon">📤</span>
              Share Wishlist
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        {wishlist.length > 0 && (
          <div className="wishlist-controls">
            <div className="controls-left">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedItems.length === wishlist.length && wishlist.length > 0}
                  onChange={handleSelectAll}
                />
                <span className="checkmark"></span>
                Select All
              </label>
              
              {selectedItems.length > 0 && (
                <button 
                  className="remove-selected-btn"
                  onClick={handleRemoveSelected}
                >
                  <span className="btn-icon">🗑️</span>
                  Remove Selected ({selectedItems.length})
                </button>
              )}
            </div>

            <div className="controls-right">
              <div className="filter-group">
                <label>Filter:</label>
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="filter-select"
                >
                  {itemTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sort-group">
                <label>Sort by:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="recent">Recently Added</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Grid */}
        {filteredWishlist.length > 0 ? (
          <div className="wishlist-grid">
            {filteredWishlist.map((item) => {
              const details = movieDetails[item.sourceId];
              
              return (
                <div key={item._id} className="wishlist-item">
                  <div className="item-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleSelectItem(item._id)}
                      id={`item-${item._id}`}
                    />
                  </div>

                  <div className="item-content">
                    <div className="item-image">
                      {loadingMovies ? (
                        <div className="image-placeholder"></div>
                      ) : (
                        <img 
                          src={details?.image || 'https://via.placeholder.com/150x200?text=No+Image'} 
                          alt={details?.title || 'Item'}
                        />
                      )}
                      <span className="item-type-badge">{item.type}</span>
                    </div>

                    <div className="item-details">
                      <h3 className="item-title">
                        <Link to={`/${item.type}/${item.sourceId}`}>
                          {details?.title || 'Loading...'}
                        </Link>
                      </h3>

                      {details?.year && (
                        <p className="item-year">{details.year}</p>
                      )}

                      {details?.rating && (
                        <div className="item-rating">
                          <span className="rating-star">⭐</span>
                          <span className="rating-value">{details.rating}</span>
                        </div>
                      )}

                      {details?.genre && (
                        <div className="item-genres">
                          {details.genre.slice(0, 3).map(genre => (
                            <span key={genre} className="genre-tag">{genre}</span>
                          ))}
                        </div>
                      )}

                      <div className="item-meta">
                        <span className="meta-date">
                          Added: {new Date(item.addedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="item-actions">
                        <Link 
                          to={`/${item.type}/${item.sourceId}`}
                          className="action-btn view-btn"
                        >
                          View Details
                        </Link>
                        <button 
                          className="action-btn remove-btn"
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-wishlist">
            <div className="empty-icon">❤️</div>
            <h3>Your wishlist is empty</h3>
            <p>Start adding items to your wishlist and they'll appear here</p>
            <div className="empty-actions">
              <Link to="/movies" className="browse-btn">Browse Movies</Link>
              <Link to="/series" className="browse-btn">Browse Series</Link>
            </div>
          </div>
        )}

        {/* Wishlist Stats */}
        {wishlist.length > 0 && (
          <div className="wishlist-stats">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <span className="stat-value">{wishlist.length}</span>
                <span className="stat-label">Total Items</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎬</div>
              <div className="stat-info">
                <span className="stat-value">
                  {wishlist.filter(item => item.type === 'movie').length}
                </span>
                <span className="stat-label">Movies</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📺</div>
              <div className="stat-info">
                <span className="stat-value">
                  {wishlist.filter(item => item.type === 'series').length}
                </span>
                <span className="stat-label">Series</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishListPage;