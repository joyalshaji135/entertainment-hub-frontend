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
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch wishlist on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [isAuthenticated, navigate]);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);

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
        setWishlist(data.data);
      } else if (Array.isArray(data)) {
        setWishlist(data);
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

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      // Update local state
      setWishlist(prev => prev.filter(item => item._id !== itemId));
      setSelectedItems(prev => prev.filter(id => id !== itemId));
      
      // Show success message
      alert('Item removed from wishlist');
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item. Please try again.');
    }
  };

  const handleRemoveSelected = async () => {
    if (selectedItems.length === 0) return;
    
    if (window.confirm(`Remove ${selectedItems.length} item(s) from wishlist?`)) {
      try {
        const token = localStorage.getItem('authToken');
        
        // Remove items one by one (or you could create a batch endpoint)
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
        
        alert('Selected items removed from wishlist');
      } catch (err) {
        console.error('Error removing items:', err);
        alert('Failed to remove some items. Please try again.');
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

  const handleAddToCart = (item) => {
    // Implement add to cart functionality
    alert(`Added ${item.title || item.name} to cart`);
  };

  const handleShareWishlist = () => {
    const wishlistData = {
      items: wishlist.map(item => ({
        title: item.title || item.name,
        type: item.type
      })),
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
      alert('Wishlist data copied to clipboard!');
    }
  };

  // Filter and sort wishlist
  const getFilteredAndSortedWishlist = () => {
    let filtered = [...wishlist];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(item => 
        item.type?.toLowerCase() === filterType.toLowerCase()
      );
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
        filtered.sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''));
        break;
      case 'type':
        filtered.sort((a, b) => (a.type || '').localeCompare(b.type || ''));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredWishlist = getFilteredAndSortedWishlist();

  // Get unique types for filter
  const itemTypes = ['all', ...new Set(wishlist.map(item => item.type).filter(Boolean))];

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
                      {type === 'all' ? 'All Types' : type}
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
                  <option value="type">Type</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Grid */}
        {filteredWishlist.length > 0 ? (
          <div className="wishlist-grid">
            {filteredWishlist.map((item) => (
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
                    <img 
                      src={item.image || item.cover || 'https://via.placeholder.com/150'} 
                      alt={item.title || item.name}
                    />
                    {item.type && (
                      <span className="item-type-badge">{item.type}</span>
                    )}
                  </div>

                  <div className="item-details">
                    <h3 className="item-title">
                      <Link to={`/${item.type?.toLowerCase()}/${item.id || item._id}`}>
                        {item.title || item.name}
                      </Link>
                    </h3>

                    {item.artist && (
                      <p className="item-artist">{item.artist}</p>
                    )}

                    {item.year && (
                      <p className="item-year">{item.year}</p>
                    )}

                    {item.rating && (
                      <div className="item-rating">
                        <span className="rating-star">⭐</span>
                        <span className="rating-value">{item.rating}</span>
                      </div>
                    )}

                    {item.genres && (
                      <div className="item-genres">
                        {item.genres.slice(0, 3).map(genre => (
                          <span key={genre} className="genre-tag">{genre}</span>
                        ))}
                      </div>
                    )}

                    <div className="item-meta">
                      <span className="meta-date">
                        Added: {new Date(item.addedAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="item-actions">
                      <button 
                        className="action-btn view-btn"
                        onClick={() => navigate(`/${item.type?.toLowerCase()}/${item.id || item._id}`)}
                      >
                        View Details
                      </button>
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
            ))}
          </div>
        ) : (
          <div className="empty-wishlist">
            <div className="empty-icon">❤️</div>
            <h3>Your wishlist is empty</h3>
            <p>Start adding items to your wishlist and they'll appear here</p>
            <div className="empty-actions">
              <Link to="/movies" className="browse-btn">Browse Movies</Link>
              <Link to="/series" className="browse-btn">Browse Series</Link>
              <Link to="/music" className="browse-btn">Browse Music</Link>
              <Link to="/anime" className="browse-btn">Browse Anime</Link>
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
                  {wishlist.filter(item => item.type === 'Movie').length}
                </span>
                <span className="stat-label">Movies</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📺</div>
              <div className="stat-info">
                <span className="stat-value">
                  {wishlist.filter(item => item.type === 'Series').length}
                </span>
                <span className="stat-label">Series</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎵</div>
              <div className="stat-info">
                <span className="stat-value">
                  {wishlist.filter(item => item.type === 'Music').length}
                </span>
                <span className="stat-label">Music</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📺</div>
              <div className="stat-info">
                <span className="stat-value">
                  {wishlist.filter(item => item.type === 'Anime').length}
                </span>
                <span className="stat-label">Anime</span>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations based on wishlist */}
        {wishlist.length > 0 && (
          <div className="recommendations-section">
            <h3 className="section-title">You Might Also Like</h3>
            <div className="recommendations-grid">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="recommendation-card">
                  <div className="rec-image">
                    <img src="https://via.placeholder.com/200x120" alt="Recommendation" />
                  </div>
                  <div className="rec-info">
                    <h4 className="rec-title">Recommended Item {index + 1}</h4>
                    <p className="rec-type">Based on your wishlist</p>
                    <button className="rec-btn">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishListPage;