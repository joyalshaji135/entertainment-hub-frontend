import React, { useState } from 'react';
import './MovieList.css';

const MovieList = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { id: 'all', label: 'All Movies', icon: '🎬' },
    { id: 'action', label: 'Action', icon: '💥' },
    { id: 'comedy', label: 'Comedy', icon: '😂' },
    { id: 'drama', label: 'Drama', icon: '🎭' },
    { id: 'scifi', label: 'Sci-Fi', icon: '🚀' },
    { id: 'horror', label: 'Horror', icon: '👻' },
    { id: 'romance', label: 'Romance', icon: '❤️' },
    { id: 'animation', label: 'Animation', icon: '🐭' },
  ];

  const sortOptions = [
    { id: 'popular', label: 'Most Popular' },
    { id: 'rating', label: 'Highest Rated' },
    { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' },
  ];

  const movies = [
    {
      id: 1,
      title: "The Matrix Resurrections",
      year: 2021,
      rating: 5.7,
      duration: "2h 28m",
      genre: ["Action", "Sci-Fi"],
      description: "Return to a world of two realities: one, everyday life; the other, what lies behind it.",
      image: "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?w=400",
      isFeatured: true,
      isNew: true
    },
    {
      id: 2,
      title: "Everything Everywhere All at Once",
      year: 2022,
      rating: 7.8,
      duration: "2h 19m",
      genre: ["Action", "Adventure", "Comedy"],
      description: "An aging Chinese immigrant is swept up in an insane adventure.",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
      isFeatured: false,
      isNew: true
    },
    {
      id: 3,
      title: "Parasite",
      year: 2019,
      rating: 8.6,
      duration: "2h 12m",
      genre: ["Comedy", "Drama", "Thriller"],
      description: "Greed and class discrimination threaten the newly formed symbiotic relationship.",
      image: "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?w=400",
      isFeatured: true,
      isNew: false
    },
    {
      id: 4,
      title: "Interstellar",
      year: 2014,
      rating: 8.6,
      duration: "2h 49m",
      genre: ["Adventure", "Drama", "Sci-Fi"],
      description: "A team of explorers travel through a wormhole in space.",
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400",
      isFeatured: false,
      isNew: false
    },
    {
      id: 5,
      title: "Inception",
      year: 2010,
      rating: 8.8,
      duration: "2h 28m",
      genre: ["Action", "Sci-Fi", "Thriller"],
      description: "A thief who steals corporate secrets through dream-sharing technology.",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
      isFeatured: true,
      isNew: false
    },
    {
      id: 6,
      title: "The Dark Knight",
      year: 2008,
      rating: 9.0,
      duration: "2h 32m",
      genre: ["Action", "Crime", "Drama"],
      description: "Batman sets out to dismantle the remaining criminal organizations.",
      image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400",
      isFeatured: true,
      isNew: false
    },
    {
      id: 7,
      title: "Avengers: Infinity War",
      year: 2018,
      rating: 8.4,
      duration: "2h 29m",
      genre: ["Action", "Adventure", "Sci-Fi"],
      description: "The Avengers and their allies must be willing to sacrifice all.",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400",
      isFeatured: false,
      isNew: false
    },
    {
      id: 8,
      title: "The Shawshank Redemption",
      year: 1994,
      rating: 9.3,
      duration: "2h 22m",
      genre: ["Drama"],
      description: "Two imprisoned men bond over a number of years.",
      image: "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?w=400",
      isFeatured: true,
      isNew: false
    },
    {
      id: 9,
      title: "Pulp Fiction",
      year: 1994,
      rating: 8.9,
      duration: "2h 34m",
      genre: ["Crime", "Drama"],
      description: "The lives of two mob hitmen, a boxer, and a pair of diner bandits.",
      image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400",
      isFeatured: false,
      isNew: false
    },
    {
      id: 10,
      title: "The Godfather",
      year: 1972,
      rating: 9.2,
      duration: "2h 55m",
      genre: ["Crime", "Drama"],
      description: "An organized crime dynasty's aging patriarch transfers control to his son.",
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400",
      isFeatured: true,
      isNew: false
    },
    {
      id: 11,
      title: "Spirited Away",
      year: 2001,
      rating: 8.6,
      duration: "2h 5m",
      genre: ["Animation", "Adventure", "Family"],
      description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
      isFeatured: false,
      isNew: false
    },
    {
      id: 12,
      title: "Joker",
      year: 2019,
      rating: 8.4,
      duration: "2h 2m",
      genre: ["Crime", "Drama", "Thriller"],
      description: "A mentally troubled stand-up comedian embarks on a downward spiral.",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400",
      isFeatured: true,
      isNew: false
    }
  ];

  const filteredMovies = movies.filter(movie => {
    if (selectedCategory === 'all') return true;
    return movie.genre.includes(selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1));
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch(sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.year - a.year;
      case 'oldest':
        return a.year - b.year;
      case 'popular':
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
  });

  return (
    <div className="movie-list-container">
      <div className="list-header">
        <div className="header-content">
          <h2 className="list-title">Browse Movies</h2>
          <p className="list-subtitle">Discover amazing movies from our collection</p>
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
          </button>
        ))}
      </div>

      <div className="movies-grid">
        {sortedMovies.map(movie => (
          <div key={movie.id} className="movie-card">
            <div className="movie-card-inner">
              <div className="movie-image">
                <img src={movie.image} alt={movie.title} />
                <div className="image-overlay">
                  <button className="play-overlay-btn">
                    <span className="play-icon">▶</span>
                  </button>
                </div>
                
                {movie.isNew && (
                  <div className="new-badge">NEW</div>
                )}
                
                {movie.isFeatured && (
                  <div className="featured-badge">FEATURED</div>
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
                  <div className="movie-duration">{movie.duration}</div>
                </div>
                
                <div className="movie-genres">
                  {movie.genre.map((genre, index) => (
                    <span key={index} className="genre-tag">{genre}</span>
                  ))}
                </div>
                
                <p className="movie-description">{movie.description}</p>
                
                <div className="movie-actions">
                  <button className="watch-btn">
                    <span className="btn-icon">▶</span>
                    Watch Now
                  </button>
                  <button className="watchlist-btn">
                    <span className="btn-icon">+</span>
                    Watchlist
                  </button>
                  <button className="details-btn">
                    <span className="btn-icon">ℹ️</span>
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="load-more">
        <button className="load-more-btn">
          Load More Movies
          <span className="load-icon">↓</span>
        </button>
      </div>
    </div>
  );
};

export default MovieList;