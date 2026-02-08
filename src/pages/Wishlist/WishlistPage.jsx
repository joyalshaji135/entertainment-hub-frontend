import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './WishlistPage.css';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      title: "Cyberpunk 2077: Phantom Liberty",
      developer: "CD Projekt Red",
      price: 29.99,
      originalPrice: 39.99,
      discount: 25,
      cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
      platforms: ["PC", "PS5", "Xbox Series X"],
      genre: ["RPG", "Action"],
      releaseDate: "2023-09-26",
      isOnSale: true,
      isReleased: true
    },
    {
      id: 2,
      title: "Final Fantasy XVI",
      developer: "Square Enix",
      price: 69.99,
      originalPrice: 69.99,
      discount: 0,
      cover: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
      platforms: ["PS5"],
      genre: ["RPG", "Action"],
      releaseDate: "2023-06-22",
      isOnSale: false,
      isReleased: true
    },
    {
      id: 3,
      title: "Starfield",
      developer: "Bethesda Game Studios",
      price: 69.99,
      originalPrice: 69.99,
      discount: 0,
      cover: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400",
      platforms: ["PC", "Xbox Series X"],
      genre: ["RPG", "Sci-Fi"],
      releaseDate: "2023-09-06",
      isOnSale: false,
      isReleased: true
    },
    {
      id: 4,
      title: "Marvel's Spider-Man 2",
      developer: "Insomniac Games",
      price: 69.99,
      originalPrice: 69.99,
      discount: 10,
      cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
      platforms: ["PS5"],
      genre: ["Action", "Adventure"],
      releaseDate: "2023-10-20",
      isOnSale: true,
      isReleased: true
    },
    {
      id: 5,
      title: "Alan Wake 2",
      developer: "Remedy Entertainment",
      price: 49.99,
      originalPrice: 59.99,
      discount: 17,
      cover: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
      platforms: ["PC", "PS5", "Xbox Series X"],
      genre: ["Survival", "Horror"],
      releaseDate: "2023-10-27",
      isOnSale: true,
      isReleased: true
    },
    {
      id: 6,
      title: "Dragon's Dogma 2",
      developer: "Capcom",
      price: 69.99,
      originalPrice: 69.99,
      discount: 0,
      cover: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400",
      platforms: ["PC", "PS5", "Xbox Series X"],
      genre: ["RPG", "Action"],
      releaseDate: "2024-03-22",
      isOnSale: false,
      isReleased: false
    }
  ]);

  const [sortBy, setSortBy] = useState('date-added');
  const [filterBy, setFilterBy] = useState('all');

  const handleRemoveFromWishlist = (id) => {
    setWishlist(wishlist.filter(game => game.id !== id));
    alert('Removed from wishlist');
  };

  const handleMoveToCart = (game) => {
    alert(`Added "${game.title}" to cart!`);
    // In real app, this would add to cart
  };

  const getTotalSavings = () => {
    return wishlist.reduce((total, game) => {
      if (game.isOnSale && game.discount > 0) {
        const savings = ((game.originalPrice - game.price) / game.originalPrice) * 100;
        return total + savings;
      }
      return total;
    }, 0).toFixed(2);
  };

  const getTotalPrice = () => {
    return wishlist.reduce((total, game) => total + game.price, 0).toFixed(2);
  };

  const getFilteredAndSortedWishlist = () => {
    let filtered = [...wishlist];

    // Apply filters
    if (filterBy === 'on-sale') {
      filtered = filtered.filter(game => game.isOnSale);
    } else if (filterBy === 'released') {
      filtered = filtered.filter(game => game.isReleased);
    } else if (filterBy === 'upcoming') {
      filtered = filtered.filter(game => !game.isReleased);
    }

    // Apply sorting
    switch(sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        filtered.sort((a, b) => b.discount - a.discount);
        break;
      case 'release-date':
        filtered.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        break;
      case 'date-added':
      default:
        // Keep original order (most recently added first)
        break;
    }

    return filtered;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date > now) {
      const diffTime = date - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `In ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredWishlist = getFilteredAndSortedWishlist();

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        {/* Header */}
        <div className="wishlist-header">
          <div className="header-content">
            <h1 className="page-title">My Wishlist</h1>
            <p className="page-subtitle">
              Track games you want to play and get notified when they go on sale
            </p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-icon">🎮</div>
              <div className="stat-content">
                <div className="stat-number">{wishlist.length}</div>
                <div className="stat-label">Games</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-number">${getTotalPrice()}</div>
                <div className="stat-label">Total Value</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎁</div>
              <div className="stat-content">
                <div className="stat-number">{getTotalSavings()}%</div>
                <div className="stat-label">Potential Savings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="wishlist-controls">
          <div className="controls-left">
            <div className="filter-group">
              <span className="filter-label">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date-added">Date Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Discount %</option>
                <option value="release-date">Release Date</option>
              </select>
            </div>
            
            <div className="filter-group">
              <span className="filter-label">Filter:</span>
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${filterBy === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterBy('all')}
                >
                  All Games
                </button>
                <button 
                  className={`filter-btn ${filterBy === 'on-sale' ? 'active' : ''}`}
                  onClick={() => setFilterBy('on-sale')}
                >
                  On Sale
                </button>
                <button 
                  className={`filter-btn ${filterBy === 'released' ? 'active' : ''}`}
                  onClick={() => setFilterBy('released')}
                >
                  Released
                </button>
                <button 
                  className={`filter-btn ${filterBy === 'upcoming' ? 'active' : ''}`}
                  onClick={() => setFilterBy('upcoming')}
                >
                  Upcoming
                </button>
              </div>
            </div>
          </div>

          <div className="controls-right">
            <button className="clear-all-btn" onClick={() => setWishlist([])}>
              Clear All
            </button>
          </div>
        </div>

        {/* Wishlist Grid */}
        {filteredWishlist.length > 0 ? (
          <div className="wishlist-grid">
            {filteredWishlist.map(game => (
              <div key={game.id} className="wishlist-item">
                <div className="item-image">
                  <img src={game.cover} alt={game.title} />
                  {game.isOnSale && game.discount > 0 && (
                    <div className="discount-badge">-{game.discount}%</div>
                  )}
                  {!game.isReleased && (
                    <div className="upcoming-badge">UPCOMING</div>
                  )}
                </div>

                <div className="item-content">
                  <div className="item-header">
                    <div className="item-info">
                      <h3 className="item-title">{game.title}</h3>
                      <p className="item-developer">{game.developer}</p>
                    </div>
                    <div className="item-price">
                      {game.isOnSale && game.discount > 0 ? (
                        <div className="price-discounted">
                          <span className="original-price">${game.originalPrice.toFixed(2)}</span>
                          <span className="current-price">${game.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="current-price">${game.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  <div className="item-meta">
                    <div className="meta-platforms">
                      <span className="meta-label">Platforms:</span>
                      <div className="platform-tags">
                        {game.platforms.map((platform, index) => (
                          <span key={index} className="platform-tag">{platform}</span>
                        ))}
                      </div>
                    </div>
                    <div className="meta-genres">
                      <span className="meta-label">Genres:</span>
                      <div className="genre-tags">
                        {game.genre.map((genre, index) => (
                          <span key={index} className="genre-tag">{genre}</span>
                        ))}
                      </div>
                    </div>
                    <div className="meta-release">
                      <span className="meta-label">Release:</span>
                      <span className={`release-date ${!game.isReleased ? 'upcoming' : ''}`}>
                        {formatDate(game.releaseDate)}
                      </span>
                    </div>
                  </div>

                  <div className="item-actions">
                    <button 
                      className="action-btn buy-btn"
                      onClick={() => handleMoveToCart(game)}
                    >
                      <span className="btn-icon">🛒</span>
                      Add to Cart
                    </button>
                    <button 
                      className="action-btn remove-btn"
                      onClick={() => handleRemoveFromWishlist(game.id)}
                    >
                      <span className="btn-icon">🗑️</span>
                      Remove
                    </button>
                    <button className="action-btn share-btn">
                      <span className="btn-icon">↗️</span>
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-wishlist">
            <div className="empty-icon">🎮</div>
            <h3 className="empty-title">Your wishlist is empty</h3>
            <p className="empty-message">
              Add games you want to play to your wishlist and get notified when they go on sale
            </p>
            <Link to="/games" className="browse-games-btn">
              <span className="btn-icon">🎯</span>
              Browse Games
            </Link>
          </div>
        )}

        {/* Summary & Actions */}
        {filteredWishlist.length > 0 && (
          <div className="wishlist-summary">
            <div className="summary-content">
              <div className="summary-stats">
                <div className="summary-stat">
                  <span className="stat-label">Total Games:</span>
                  <span className="stat-value">{filteredWishlist.length}</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Total Value:</span>
                  <span className="stat-value">${getTotalPrice()}</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Potential Savings:</span>
                  <span className="stat-value savings">{getTotalSavings()}%</span>
                </div>
              </div>
              
              <div className="summary-actions">
                <button className="summary-btn primary-btn">
                  <span className="btn-icon">🛒</span>
                  Add All to Cart
                </button>
                <button className="summary-btn secondary-btn">
                  <span className="btn-icon">📧</span>
                  Get Price Alerts
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;