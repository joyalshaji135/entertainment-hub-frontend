// pages/Profile/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login or show message
      return;
    }
    
    // Load user data from localStorage or context
    const loadUserData = () => {
      setLoading(true);
      
      // Get user data from localStorage or use from context
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        // Enhance with profile data
        setUserData({
          id: parsedUser.id || parsedUser._id || 1,
          name: parsedUser.name || 'User',
          email: parsedUser.email || 'user@example.com',
          avatar: parsedUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
          cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200',
          bio: parsedUser.bio || 'Welcome to my profile! I love watching movies, series, and discovering new content.',
          location: parsedUser.location || 'EntertainHub',
          joinDate: parsedUser.joinDate || new Date().toISOString().split('T')[0],
          level: 1,
          xp: 0,
          nextLevelXp: 1000,
          badges: [
            { id: 1, name: 'New Member', icon: '🌟', color: '#4ecdc4' },
          ],
          stats: {
            moviesWatched: 0,
            seriesWatched: 0,
            musicListened: 0,
            animeWatched: 0,
            reviews: 0,
            wishlist: 0
          },
          recentActivity: [
            { id: 1, type: 'join', title: 'Joined EntertainHub', time: 'Just now', icon: '🎉' },
          ],
          favoriteContent: []
        });
      }
      setLoading(false);
    };

    loadUserData();
  }, [isAuthenticated, user]);

  // Fetch wishlist count if needed
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWishlistCount();
    }
  }, [isAuthenticated, user]);

  const fetchWishlistCount = async () => {
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

      if (response.ok) {
        const data = await response.json();
        let wishlistItems = [];
        
        if (data.data) {
          wishlistItems = data.data;
        } else if (Array.isArray(data)) {
          wishlistItems = data;
        }
        
        setUserData(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            wishlist: wishlistItems.length
          }
        }));
      }
    } catch (err) {
      console.error('Error fetching wishlist count:', err);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
    { id: 'activity', label: 'Activity', icon: '📝' },
  ];

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="profile-error">
        <div className="error-icon">👤</div>
        <h2>Please Login</h2>
        <p>You need to be logged in to view your profile</p>
        <Link to="/login" className="login-btn">Go to Login</Link>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-error">
        <div className="error-icon">❌</div>
        <h2>Profile Not Found</h2>
        <p>Unable to load profile data</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  const xpPercentage = (userData.xp / userData.nextLevelXp) * 100;

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-cover">
          <img src={userData.cover} alt="Cover" className="cover-image" />
          <div className="cover-overlay"></div>
        </div>

        <div className="profile-info">
          <div className="avatar-section">
            <div className="avatar-container">
              <img src={userData.avatar} alt={userData.name} className="user-avatar" />
              <div className="level-badge">Lvl {userData.level}</div>
            </div>
          </div>

          <div className="info-section">
            <div className="user-main-info">
              <h1 className="user-name">{userData.name}</h1>
              <div className="user-meta">
                <span className="meta-item">
                  <span className="meta-icon">📧</span>
                  {userData.email}
                </span>
                <span className="meta-item">
                  <span className="meta-icon">📍</span>
                  {userData.location}
                </span>
                <span className="meta-item">
                  <span className="meta-icon">📅</span>
                  Member since {new Date(userData.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-container">
        {/* Left Sidebar */}
        <div className="profile-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">About</h3>
            <p className="bio-text">{userData.bio}</p>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Badges</h3>
            <div className="badges-grid">
              {userData.badges.map(badge => (
                <div 
                  key={badge.id}
                  className="badge-item"
                  style={{ '--badge-color': badge.color }}
                  title={badge.name}
                >
                  <span className="badge-icon">{badge.icon}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Stats</h3>
            <div className="quick-stats">
              <div className="stat-item">
                <div className="stat-icon">🎬</div>
                <div className="stat-content">
                  <div className="stat-number">{userData.stats.moviesWatched}</div>
                  <div className="stat-label">Movies</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">📺</div>
                <div className="stat-content">
                  <div className="stat-number">{userData.stats.seriesWatched}</div>
                  <div className="stat-label">Series</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🎵</div>
                <div className="stat-content">
                  <div className="stat-number">{userData.stats.musicListened}</div>
                  <div className="stat-label">Music</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">📺</div>
                <div className="stat-content">
                  <div className="stat-number">{userData.stats.animeWatched}</div>
                  <div className="stat-label">Anime</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">❤️</div>
                <div className="stat-content">
                  <div className="stat-number">{userData.stats.wishlist}</div>
                  <div className="stat-label">Wishlist</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {/* Tabs Navigation */}
          <div className="profile-tabs">
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

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                {/* Recent Activity */}
                <div className="activity-section">
                  <h3 className="section-title">Recent Activity</h3>
                  <div className="activity-list">
                    {userData.recentActivity.map(activity => (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-icon">{activity.icon}</div>
                        <div className="activity-content">
                          <div className="activity-title">{activity.title}</div>
                          <div className="activity-time">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="wishlist-tab">
                <h2 className="tab-title">My Wishlist</h2>
                <div className="wishlist-stats">
                  <div className="stat-card">
                    <div className="stat-value">{userData.stats.wishlist}</div>
                    <div className="stat-label">Items in Wishlist</div>
                  </div>
                </div>
                <div className="wishlist-actions">
                  <Link to="/movies" className="browse-btn">Browse Movies</Link>
                  <Link to="/series" className="browse-btn">Browse Series</Link>
                  <Link to="/music" className="browse-btn">Browse Music</Link>
                  <Link to="/anime" className="browse-btn">Browse Anime</Link>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="activity-tab">
                <h2 className="tab-title">Activity History</h2>
                <div className="activity-timeline">
                  {userData.recentActivity.map(activity => (
                    <div key={activity.id} className="timeline-item">
                      <div className="timeline-icon">{activity.icon}</div>
                      <div className="timeline-content">
                        <div className="timeline-title">{activity.title}</div>
                        <div className="timeline-time">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;