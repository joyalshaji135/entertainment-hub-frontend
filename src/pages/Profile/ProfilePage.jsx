import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    id: 1,
    name: 'John Gaming',
    email: 'john.gaming@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200',
    bio: 'Hardcore gamer and streamer. Love RPGs and competitive FPS games.',
    location: 'New York, USA',
    joinDate: '2023-01-15',
    level: 42,
    xp: 12500,
    nextLevelXp: 15000,
    badges: [
      { id: 1, name: 'Early Adopter', icon: '🚀', color: '#4ecdc4' },
      { id: 2, name: 'Completionist', icon: '🏆', color: '#ffd166' },
      { id: 3, name: 'Community Hero', icon: '🦸', color: '#ef476f' },
      { id: 4, name: 'Streamer', icon: '🎥', color: '#118ab2' },
    ],
    stats: {
      gamesPlayed: 156,
      hoursPlayed: '2,450',
      achievements: 342,
      friends: 89,
      reviews: 24,
      wishlist: 18
    },
    recentActivity: [
      { id: 1, type: 'achievement', game: 'Cyberpunk 2077', title: 'Night City Legend', time: '2 hours ago', icon: '🏆' },
      { id: 2, type: 'review', game: 'Elden Ring', title: 'Posted a review', time: '1 day ago', icon: '📝' },
      { id: 3, type: 'purchase', game: 'God of War Ragnarök', title: 'Purchased game', time: '3 days ago', icon: '🛒' },
      { id: 4, type: 'friend', game: null, title: 'Added new friend', time: '1 week ago', icon: '👥' },
    ],
    favoriteGames: [
      { id: 1, title: 'The Witcher 3', genre: 'RPG', hours: 120, cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400' },
      { id: 2, title: 'Overwatch 2', genre: 'FPS', hours: 85, cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400' },
      { id: 3, title: 'Stardew Valley', genre: 'Simulation', hours: 65, cover: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400' },
      { id: 4, title: 'Red Dead Redemption 2', genre: 'Action', hours: 95, cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400' },
    ]
  });

  const [editForm, setEditForm] = useState({ ...userData });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'games', label: 'My Games', icon: '🎮' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'friends', label: 'Friends', icon: '👥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setUserData(editForm);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const xpPercentage = (userData.xp / userData.nextLevelXp) * 100;

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-cover">
          <img src={userData.cover} alt="Cover" className="cover-image" />
          <div className="cover-overlay"></div>
          <button className="edit-cover-btn">
            <span className="edit-icon">📷</span>
            Edit Cover
          </button>
        </div>

        <div className="profile-info">
          <div className="avatar-section">
            <div className="avatar-container">
              <img src={userData.avatar} alt={userData.name} className="user-avatar" />
              <div className="level-badge">Lvl {userData.level}</div>
              <button className="edit-avatar-btn">
                <span className="edit-icon">📷</span>
              </button>
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

            <div className="profile-actions">
              <button 
                className="action-btn edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                <span className="btn-icon">✏️</span>
                Edit Profile
              </button>
              <button className="action-btn share-profile-btn">
                <span className="btn-icon">↗️</span>
                Share Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-container">
        {/* Left Sidebar */}
        <div className="profile-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Progress</h3>
            <div className="xp-progress">
              <div className="xp-info">
                <span className="xp-label">Level {userData.level}</span>
                <span className="xp-count">{userData.xp.toLocaleString()} / {userData.nextLevelXp.toLocaleString()} XP</span>
              </div>
              <div className="xp-bar">
                <div 
                  className="xp-fill"
                  style={{ width: `${xpPercentage}%` }}
                ></div>
              </div>
              <div className="next-level">
                {userData.nextLevelXp - userData.xp} XP to Level {userData.level + 1}
              </div>
            </div>
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
            <h3 className="sidebar-title">Quick Stats</h3>
            <div className="quick-stats">
              <div className="stat-item">
                <div className="stat-icon">🎮</div>
                <div className="stat-content">
                  <div className="stat-number">{userData.stats.gamesPlayed}</div>
                  <div className="stat-label">Games Played</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <div className="stat-number">{userData.stats.hoursPlayed}</div>
                  <div className="stat-label">Hours Played</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <div className="stat-number">{userData.stats.achievements}</div>
                  <div className="stat-label">Achievements</div>
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
                {/* Bio Section */}
                <div className="bio-section">
                  <div className="section-header">
                    <h3 className="section-title">About Me</h3>
                    <button className="edit-section-btn" onClick={() => setIsEditing(true)}>
                      <span className="edit-icon">✏️</span>
                    </button>
                  </div>
                  <p className="bio-text">{userData.bio}</p>
                </div>

                {/* Recent Activity */}
                <div className="activity-section">
                  <h3 className="section-title">Recent Activity</h3>
                  <div className="activity-list">
                    {userData.recentActivity.map(activity => (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-icon">{activity.icon}</div>
                        <div className="activity-content">
                          <div className="activity-title">{activity.title}</div>
                          {activity.game && (
                            <div className="activity-game">{activity.game}</div>
                          )}
                          <div className="activity-time">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Favorite Games */}
                <div className="games-section">
                  <div className="section-header">
                    <h3 className="section-title">Favorite Games</h3>
                    <Link to="/games" className="view-all-link">
                      View All →
                    </Link>
                  </div>
                  <div className="favorite-games">
                    {userData.favoriteGames.map(game => (
                      <div key={game.id} className="favorite-game">
                        <img src={game.cover} alt={game.title} className="game-cover" />
                        <div className="game-info">
                          <h4 className="game-title">{game.title}</h4>
                          <div className="game-meta">
                            <span className="game-genre">{game.genre}</span>
                            <span className="game-hours">{game.hours} hours</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'games' && (
              <div className="games-tab">
                <div className="games-header">
                  <h2 className="tab-title">My Games Library</h2>
                  <div className="games-filters">
                    <button className="filter-btn active">All Games</button>
                    <button className="filter-btn">Recently Played</button>
                    <button className="filter-btn">Most Played</button>
                    <button className="filter-btn">Installed</button>
                  </div>
                </div>
                <div className="games-library">
                  {userData.favoriteGames.map(game => (
                    <div key={game.id} className="library-game">
                      <img src={game.cover} alt={game.title} className="library-cover" />
                      <div className="library-info">
                        <h4 className="library-title">{game.title}</h4>
                        <div className="library-meta">
                          <span className="meta-item">{game.genre}</span>
                          <span className="meta-item">{game.hours} hours</span>
                        </div>
                        <div className="library-actions">
                          <button className="action-btn play-btn">
                            <span className="btn-icon">▶</span>
                            Play
                          </button>
                          <button className="action-btn details-btn">
                            <span className="btn-icon">ℹ️</span>
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-tab">
                <h2 className="tab-title">Account Settings</h2>
                <div className="settings-sections">
                  <div className="settings-section">
                    <h3 className="settings-title">Profile Information</h3>
                    <div className="settings-form">
                      <div className="form-group">
                        <label htmlFor="name">Display Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={editForm.name}
                          onChange={handleInputChange}
                          className="settings-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleInputChange}
                          className="settings-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                          id="bio"
                          name="bio"
                          value={editForm.bio}
                          onChange={handleInputChange}
                          className="settings-textarea"
                          rows="4"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={editForm.location}
                          onChange={handleInputChange}
                          className="settings-input"
                        />
                      </div>
                      <div className="form-actions">
                        <button className="save-btn" onClick={handleEditSubmit}>
                          Save Changes
                        </button>
                        <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="edit-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Profile</h2>
              <button className="modal-close" onClick={() => setIsEditing(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="edit-name">Display Name</label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-email">Email Address</label>
                  <input
                    type="email"
                    id="edit-email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="edit-bio">Bio</label>
                  <textarea
                    id="edit-bio"
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-location">Location</label>
                  <input
                    type="text"
                    id="edit-location"
                    name="location"
                    value={editForm.location}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;