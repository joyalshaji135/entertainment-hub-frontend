// pages/SeriesDetail/SeriesDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './SeriesDetail.css';

const SeriesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  
  // Wishlist state
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);
  
  // Comments state
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [editHoverRating, setEditHoverRating] = useState(0);

  useEffect(() => {
    fetchSeriesDetails();
  }, [id]);

  useEffect(() => {
    if (series) {
      fetchComments();
      if (isAuthenticated) {
        checkWishlistStatus();
      }
    }
  }, [series, isAuthenticated]);

  const API_KEY = import.meta.env.VITE_API_KEY;

  const fetchSeriesDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://imdb-top-100-movies.p.rapidapi.com/series/${id}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'imdb-top-100-movies.p.rapidapi.com',
          'x-rapidapi-key': API_KEY
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch series details');
      }

      const data = await response.json();
      
      // Enhance data with additional properties
      const enhancedData = {
        ...data,
        id: data.id || id,
        seasons: extractSeasons(data.year),
        episodes: extractEpisodes(data.year),
        status: determineStatus(data.year),
        sourceType: 'series'
      };

      setSeries(enhancedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Comments Functions
  const fetchComments = async () => {
    setCommentsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/comments/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      
      // Filter comments for this series
      let seriesComments = [];
      if (data.data) {
        seriesComments = data.data.filter(comment => comment.movieId === id);
      } else if (Array.isArray(data)) {
        seriesComments = data.filter(comment => comment.movieId === id);
      }
      
      setComments(seriesComments);
    } catch (err) {
      console.error('Error fetching comments:', err);
      showNotification('Failed to load comments', 'error');
    } finally {
      setCommentsLoading(false);
    }
  };

  const submitComment = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      showNotification('Please enter a comment', 'error');
      return;
    }

    if (newRating === 0) {
      showNotification('Please select a rating', 'error');
      return;
    }

    setSubmittingComment(true);

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:5000/comments/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user._id || user.id,
          movieId: id, // Using movieId field as per API
          comment: newComment,
          rating: newRating
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add comment');
      }

      if (data.status === 'success') {
        // Add new comment to list with user info
        const newCommentObj = {
          _id: data.data?._id || `temp-${Date.now()}`,
          userId: user._id || user.id,
          movieId: id,
          comment: newComment,
          rating: newRating,
          createdAt: new Date().toISOString(),
          user: {
            name: user.name || 'User',
            avatar: user.avatar || null
          }
        };
        
        setComments(prev => [newCommentObj, ...prev]);
        setNewComment('');
        setNewRating(0);
        
        showNotification('Comment added successfully!', 'success');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      showNotification(err.message || 'Failed to add comment', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const deleteComment = async (commentId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`http://localhost:5000/comments/delete/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'userId': user._id || user.id
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete comment');
      }

      if (data.status === 'success') {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
        showNotification('Comment deleted successfully!', 'success');
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      showNotification(err.message || 'Failed to delete comment', 'error');
    }
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.comment);
    setEditRating(comment.rating);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditCommentText('');
    setEditRating(0);
  };

  const updateComment = async (commentId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!editCommentText.trim()) {
      showNotification('Please enter a comment', 'error');
      return;
    }

    if (editRating === 0) {
      showNotification('Please select a rating', 'error');
      return;
    }

    try {
      // Note: You'll need to create an update endpoint if not exists
      // For now, we'll just update locally
      setComments(prev => prev.map(comment => 
        comment._id === commentId 
          ? { ...comment, comment: editCommentText, rating: editRating }
          : comment
      ));
      
      setEditingCommentId(null);
      setEditCommentText('');
      setEditRating(0);
      
      showNotification('Comment updated successfully!', 'success');
      
      // TODO: Implement actual API update when endpoint is available
      // const token = localStorage.getItem('authToken');
      // const response = await fetch(`http://localhost:5000/comments/update/${commentId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     comment: editCommentText,
      //     rating: editRating
      //   })
      // });
      
    } catch (err) {
      console.error('Error updating comment:', err);
      showNotification('Failed to update comment', 'error');
    }
  };

  // Wishlist Functions
  const checkWishlistStatus = async () => {
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
      
      let wishlistItems = [];
      if (data.data) {
        wishlistItems = data.data;
      } else if (Array.isArray(data)) {
        wishlistItems = data;
      }

      const wishlistItem = wishlistItems.find(item => item.sourceId === id);
      
      if (wishlistItem) {
        setIsInWishlist(true);
        setWishlistId(wishlistItem._id);
      } else {
        setIsInWishlist(false);
        setWishlistId(null);
      }
      
    } catch (err) {
      console.error('Error checking wishlist status:', err);
    }
  };

  const addToWishlist = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
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
          sourceId: id,
          sourceType: 'series',
          title: series.title,
          image: series.image,
          rating: series.rating,
          year: series.year,
          rank: series.rank,
          genre: series.genre
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to wishlist');
      }

      if (data.status === 'success') {
        setIsInWishlist(true);
        setWishlistId(data.data._id);
        showNotification('Added to wishlist successfully!', 'success');
        return true;
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      showNotification(err.message || 'Failed to add to wishlist', 'error');
      return false;
    } finally {
      setWishlistLoading(false);
    }
  };

  const removeFromWishlist = async () => {
    if (!isAuthenticated || !user || !wishlistId) {
      return false;
    }

    setWishlistLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`http://localhost:5000/wish-list/remove/${wishlistId}`, {
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
        setIsInWishlist(false);
        setWishlistId(null);
        showNotification('Removed from wishlist successfully!', 'success');
        return true;
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      showNotification(err.message || 'Failed to remove from wishlist', 'error');
      return false;
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isInWishlist) {
      await removeFromWishlist();
    } else {
      await addToWishlist();
    }
  };

  const handleWatchNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/watch/series/${id}`);
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

  const extractSeasons = (yearStr) => {
    if (!yearStr) return 3;
    if (yearStr.includes('-')) {
      const years = yearStr.split('-').map(y => parseInt(y));
      if (years.length === 2 && !isNaN(years[0]) && !isNaN(years[1])) {
        return Math.max(1, Math.ceil((years[1] - years[0]) / 1.5) + 1);
      }
    }
    return Math.floor(Math.random() * 5) + 3;
  };

  const extractEpisodes = (yearStr) => {
    const seasons = extractSeasons(yearStr);
    return seasons * (Math.floor(Math.random() * 8) + 8);
  };

  const determineStatus = (yearStr) => {
    if (!yearStr) return 'Unknown';
    if (yearStr.includes('-')) {
      const endYear = yearStr.split('-')[1];
      if (endYear && parseInt(endYear) < new Date().getFullYear()) {
        return 'Ended';
      }
      return 'Ongoing';
    }
    return parseInt(yearStr) < new Date().getFullYear() ? 'Ended' : 'Upcoming';
  };

  const calculateAverageRating = () => {
    if (comments.length === 0) return 0;
    const sum = comments.reduce((acc, comment) => acc + comment.rating, 0);
    return (sum / comments.length).toFixed(1);
  };

  const renderStars = (rating, setRating, hoverRating, setHoverRating, disabled = false) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
            onClick={() => !disabled && setRating(star)}
            onMouseEnter={() => !disabled && setHoverRating(star)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
            disabled={disabled}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="series-detail-loading">
        <div className="loading-spinner-large"></div>
        <p>Loading series details...</p>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="series-detail-error">
        <div className="error-icon">📺</div>
        <h2>Series Not Found</h2>
        <p>{error || 'Unable to load series details'}</p>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Go Back
        </button>
      </div>
    );
  }

  const averageRating = calculateAverageRating();

  return (
    <div className="series-detail-container">
      {/* Hero Section */}
      <div 
        className="series-hero"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 12, 41, 0.8), rgba(15, 12, 41, 0.95)), url(${series.big_image || series.image})`
        }}
      >
        <button onClick={() => navigate(-1)} className="back-button">
          <span className="back-icon">←</span>
          Back
        </button>

        <div className="hero-content">
          <div className="series-poster">
            <img src={series.image} alt={series.title} />
            <div className="poster-rating">
              <span className="rating-star">⭐</span>
              <span className="rating-value">{series.rating}</span>
            </div>
            {comments.length > 0 && (
              <div className="user-rating-badge">
                <span className="rating-icon">👥</span>
                <span className="rating-value">{averageRating}</span>
              </div>
            )}
          </div>

          <div className="series-hero-info">
            <div className="series-badges">
              <span className="rank-badge">
                <span className="rank-icon">👑</span>
                Top #{series.rank}
              </span>
              <span className="year-badge">{series.year}</span>
              <span className={`status-badge ${series.status?.toLowerCase() || 'ongoing'}`}>
                {series.status || 'Ongoing'}
              </span>
            </div>

            <h1 className="series-title">{series.title}</h1>

            <div className="series-metadata">
              {series.genre && series.genre.map((genre, index) => (
                <span key={index} className="metadata-item">{genre}</span>
              ))}
            </div>

            <div className="series-stats">
              <div className="stat">
                <span className="stat-label">Seasons</span>
                <span className="stat-value">{series.seasons}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Episodes</span>
                <span className="stat-value">{series.episodes}</span>
              </div>
              <div className="stat">
                <span className="stat-label">IMDb</span>
                <span className="stat-value">{series.rating}</span>
              </div>
            </div>

            <div className="series-actions">
              <button className="watch-now-btn" onClick={handleWatchNow}>
                <span className="btn-icon">▶</span>
                Watch Now
              </button>
              <button 
                className={`wishlist-btn ${isInWishlist ? 'in-wishlist' : ''}`}
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
              >
                <span className="btn-icon">
                  {wishlistLoading ? '⏳' : (isInWishlist ? '❤️' : '🤍')}
                </span>
                {wishlistLoading 
                  ? 'Processing...' 
                  : (isInWishlist ? 'In Wishlist' : 'Add to Wishlist')
                }
              </button>
              {series.trailer && (
                <a 
                  href={series.trailer} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="trailer-btn"
                >
                  <span className="btn-icon">🎬</span>
                  Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="series-content">
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button 
            className={`tab-btn ${activeTab === 'episodes' ? 'active' : ''}`}
            onClick={() => setActiveTab('episodes')}
          >
            Episodes
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({comments.length})
          </button>
          {series.trailer && (
            <button 
              className={`tab-btn ${activeTab === 'trailer' ? 'active' : ''}`}
              onClick={() => setActiveTab('trailer')}
            >
              Trailer
            </button>
          )}
        </div>

        <div className="tab-content">
          {activeTab === 'about' && (
            <div className="about-tab">
              <h3 className="tab-title">Storyline</h3>
              <p className="series-description">{series.description}</p>
              
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Release Year</span>
                  <span className="detail-value">{series.year}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Seasons</span>
                  <span className="detail-value">{series.seasons}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Episodes</span>
                  <span className="detail-value">{series.episodes}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className={`detail-value status-${series.status?.toLowerCase() || 'ongoing'}`}>
                    {series.status || 'Ongoing'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">User Rating</span>
                  <span className="detail-value rating">
                    ⭐ {averageRating}/5 ({comments.length} reviews)
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">IMDb ID</span>
                  <span className="detail-value">
                    <a href={series.imdb_link} target="_blank" rel="noopener noreferrer">
                      {series.imdbid}
                    </a>
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'episodes' && (
            <div className="episodes-tab">
              <h3 className="tab-title">Episodes</h3>
              <p className="coming-soon">Episode guide coming soon!</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              <div className="reviews-header">
                <h3 className="tab-title">User Reviews</h3>
                <div className="reviews-summary">
                  <div className="average-rating">
                    <span className="big-rating">{averageRating}</span>
                    <div className="star-display">
                      {renderStars(averageRating, null, null, null, true)}
                    </div>
                    <span className="total-reviews">Based on {comments.length} reviews</span>
                  </div>
                </div>
              </div>

              {/* Add Review Form */}
              {isAuthenticated ? (
                <div className="add-review">
                  <h4>Write a Review</h4>
                  <div className="rating-input">
                    <label>Your Rating:</label>
                    {renderStars(newRating, setNewRating, hoverRating, setHoverRating)}
                  </div>
                  <textarea
                    className="review-textarea"
                    placeholder="Share your thoughts about this series..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows="4"
                  />
                  <button 
                    className="submit-review-btn"
                    onClick={submitComment}
                    disabled={submittingComment}
                  >
                    {submittingComment ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              ) : (
                <div className="login-prompt">
                  <p>Please <button onClick={() => navigate('/login')} className="login-link">login</button> to write a review</p>
                </div>
              )}

              {/* Reviews List */}
              <div className="reviews-list">
                {commentsLoading ? (
                  <div className="loading-comments">
                    <div className="loading-spinner-small"></div>
                    <p>Loading reviews...</p>
                  </div>
                ) : comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment._id} className="review-card">
                      {editingCommentId === comment._id ? (
                        <div className="edit-review">
                          <div className="rating-input">
                            <label>Rating:</label>
                            {renderStars(editRating, setEditRating, editHoverRating, setEditHoverRating)}
                          </div>
                          <textarea
                            className="review-textarea"
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            rows="3"
                          />
                          <div className="edit-actions">
                            <button 
                              className="save-edit-btn"
                              onClick={() => updateComment(comment._id)}
                            >
                              Save
                            </button>
                            <button 
                              className="cancel-edit-btn"
                              onClick={cancelEditing}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="review-header">
                            <div className="reviewer-info">
                              <div className="reviewer-avatar">
                                {comment.user?.avatar ? (
                                  <img src={comment.user.avatar} alt={comment.user.name} />
                                ) : (
                                  <span className="avatar-placeholder">
                                    {comment.user?.name?.charAt(0) || 'U'}
                                  </span>
                                )}
                              </div>
                              <div className="reviewer-details">
                                <span className="reviewer-name">
                                  {comment.user?.name || 'User'}
                                </span>
                                <span className="review-date">
                                  {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                            <div className="review-rating">
                              {[1, 2, 3, 4, 5].map(star => (
                                <span 
                                  key={star} 
                                  className={`star ${star <= comment.rating ? 'filled' : ''}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="review-text">{comment.comment}</p>
                          
                          {/* Show edit/delete buttons for user's own comments */}
                          {user && (user._id === comment.userId || user.id === comment.userId) && (
                            <div className="review-actions">
                              <button 
                                className="edit-review-btn"
                                onClick={() => startEditing(comment)}
                              >
                                <span className="btn-icon">✏️</span>
                                Edit
                              </button>
                              <button 
                                className="delete-review-btn"
                                onClick={() => deleteComment(comment._id)}
                              >
                                <span className="btn-icon">🗑️</span>
                                Delete
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-reviews">
                    <div className="no-reviews-icon">💬</div>
                    <h4>No reviews yet</h4>
                    <p>Be the first to share your thoughts about this series!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'trailer' && series.trailer_embed_link && (
            <div className="trailer-tab">
              <h3 className="tab-title">Official Trailer</h3>
              <div className="trailer-container">
                <iframe
                  src={series.trailer_embed_link}
                  title={`${series.title} Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeriesDetail;