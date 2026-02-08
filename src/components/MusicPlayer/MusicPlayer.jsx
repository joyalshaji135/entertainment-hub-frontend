import React, { useState, useEffect, useRef } from 'react';
import './MusicPlayer.css';

const MusicPlayer = ({ track, isPlaying, onPlayPause, onNext, onPrevious }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // Default 3 minutes
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  useEffect(() => {
    if (track) {
      setCurrentTime(0);
      setProgress(0);
      // Simulate track duration
      setDuration(Math.floor(Math.random() * 300) + 60); // 1-5 minutes
    }
  }, [track]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            onNext?.();
            return 0;
          }
          const newTime = prev + 1;
          setProgress((newTime / duration) * 100);
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, onNext]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    setCurrentTime(newTime);
    setProgress(clickPosition * 100);
  };

  const handleVolumeClick = (e) => {
    const rect = volumeRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.min(100, Math.max(0, clickPosition * 100));
    setVolume(newVolume);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  if (!track) {
    return (
      <div className="music-player empty">
        <div className="empty-player">
          <div className="empty-icon">🎵</div>
          <p>No track selected</p>
          <p className="empty-subtitle">Select a track to start listening</p>
        </div>
      </div>
    );
  }

  return (
    <div className="music-player">
      <div className="player-container">
        {/* Track Info */}
        <div className="track-info-section">
          <div className="track-cover">
            <img src={track.cover} alt={track.title} />
            {isPlaying && <div className="playing-pulse"></div>}
          </div>
          <div className="track-details">
            <h3 className="track-title">{track.title}</h3>
            <p className="track-artist">{track.artist}</p>
            <p className="track-album">{track.album} • {track.year}</p>
          </div>
          <div className="track-actions">
            <button className="action-btn favorite-btn">
              <span className="action-icon">❤️</span>
            </button>
            <button className="action-btn more-btn">
              <span className="action-icon">⋯</span>
            </button>
          </div>
        </div>

        {/* Player Controls */}
        <div className="player-controls">
          <div className="control-buttons">
            <button 
              className={`control-btn shuffle-btn ${isShuffle ? 'active' : ''}`}
              onClick={toggleShuffle}
              title="Shuffle"
            >
              <span className="control-icon">🔀</span>
            </button>
            
            <button 
              className="control-btn prev-btn"
              onClick={onPrevious}
              title="Previous"
            >
              <span className="control-icon">⏮</span>
            </button>
            
            <button 
              className="play-pause-btn"
              onClick={onPlayPause}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              <span className="play-pause-icon">
                {isPlaying ? '⏸' : '▶'}
              </span>
            </button>
            
            <button 
              className="control-btn next-btn"
              onClick={onNext}
              title="Next"
            >
              <span className="control-icon">⏭</span>
            </button>
            
            <button 
              className={`control-btn repeat-btn ${isRepeat ? 'active' : ''}`}
              onClick={toggleRepeat}
              title="Repeat"
            >
              <span className="control-icon">🔁</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <span className="time-current">{formatTime(currentTime)}</span>
            <div 
              className="progress-bar"
              ref={progressRef}
              onClick={handleProgressClick}
            >
              <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              >
                <div className="progress-handle"></div>
              </div>
            </div>
            <span className="time-total">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="volume-section">
          <button 
            className="volume-btn"
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <span className="volume-icon">
              {isMuted ? '🔇' : volume > 50 ? '🔊' : '🔉'}
            </span>
          </button>
          <div 
            className="volume-bar"
            ref={volumeRef}
            onClick={handleVolumeClick}
          >
            <div 
              className="volume-fill"
              style={{ width: `${isMuted ? 0 : volume}%` }}
            >
              <div className="volume-handle"></div>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>

      {/* Additional Features */}
      <div className="player-extras">
        <div className="extra-features">
          <button className="extra-btn" title="Lyrics">
            <span className="extra-icon">📝</span>
            <span className="extra-label">Lyrics</span>
          </button>
          <button className="extra-btn" title="Queue">
            <span className="extra-icon">📋</span>
            <span className="extra-label">Queue</span>
          </button>
          <button className="extra-btn" title="Share">
            <span className="extra-icon">↗️</span>
            <span className="extra-label">Share</span>
          </button>
          <button className="extra-btn" title="Add to Playlist">
            <span className="extra-icon">+</span>
            <span className="extra-label">Add to Playlist</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;