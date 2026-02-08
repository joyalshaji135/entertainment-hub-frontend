import React, { useState, useEffect, useCallback } from 'react';
import './MovieSlider.css';

const MovieSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [movies, setMovies] = useState([]);

  // Sample movie data
  const featuredMovies = [
    {
      id: 1,
      title: "Avengers: Endgame",
      genre: "Action, Adventure",
      rating: 8.4,
      duration: "3h 2m",
      year: 2019,
      description: "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions.",
      image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800",
      trailer: "https://www.youtube.com/watch?v=TcMBFSGVi1c"
    },
    {
      id: 2,
      title: "Dune: Part Two",
      genre: "Sci-Fi, Adventure",
      rating: 8.7,
      duration: "2h 46m",
      year: 2024,
      description: "Paul Atreides unites with the Fremen people on the desert planet Arrakis to fight against the oppressive Harkonnens.",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w-800",
      trailer: "https://www.youtube.com/watch?v=Way9Dexny3w"
    },
    {
      id: 3,
      title: "Spider-Man: No Way Home",
      genre: "Action, Adventure",
      rating: 8.2,
      duration: "2h 28m",
      year: 2021,
      description: "Peter Parker's world is turned upside down when his identity is revealed, leading him to seek Doctor Strange's help.",
      image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800",
      trailer: "https://www.youtube.com/watch?v=JfVOs4VSpmA"
    },
    {
      id: 4,
      title: "The Batman",
      genre: "Action, Crime",
      rating: 7.8,
      duration: "2h 56m",
      year: 2022,
      description: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
      image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=800",
      trailer: "https://www.youtube.com/watch?v=mqqft2x_Aa4"
    },
    {
      id: 5,
      title: "Top Gun: Maverick",
      genre: "Action, Drama",
      rating: 8.3,
      duration: "2h 10m",
      year: 2022,
      description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, training a detachment of graduates.",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      trailer: "https://www.youtube.com/watch?v=giXco2jaZ_4"
    }
  ];

  useEffect(() => {
    setMovies(featuredMovies);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  }, [movies.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (isPaused || movies.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, isPaused, nextSlide, movies.length]);

  const currentMovie = movies[currentSlide];

  if (!currentMovie) return null;

  return (
    <div 
      className="movie-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="slider-background">
        <div 
          className="background-image"
          style={{ backgroundImage: `url(${currentMovie.image})` }}
        />
        <div className="background-overlay"></div>
      </div>

      <div className="slider-content">
        <div className="movie-info">
          <div className="movie-badge">
            <span className="badge-text">NEW RELEASE</span>
          </div>
          
          <h1 className="movie-title">{currentMovie.title}</h1>
          
          <div className="movie-meta">
            <span className="meta-item rating">
              <span className="star">⭐</span>
              {currentMovie.rating}/10
            </span>
            <span className="meta-item">{currentMovie.year}</span>
            <span className="meta-item">{currentMovie.duration}</span>
            <span className="meta-item genre">{currentMovie.genre}</span>
          </div>
          
          <p className="movie-description">{currentMovie.description}</p>
          
          <div className="movie-actions">
            <button className="action-btn play-btn">
              <span className="btn-icon">▶</span>
              Watch Now
            </button>
            <button className="action-btn trailer-btn">
              <span className="btn-icon">🎬</span>
              Watch Trailer
            </button>
            <button className="action-btn favorite-btn">
              <span className="btn-icon">❤️</span>
              Add to Watchlist
            </button>
          </div>
        </div>

        <div className="slider-controls">
          <button className="control-btn prev-btn" onClick={prevSlide}>
            ◀
          </button>
          
          <div className="slide-indicators">
            {movies.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <button className="control-btn next-btn" onClick={nextSlide}>
            ▶
          </button>
        </div>
      </div>

      <div className="slide-counter">
        <span className="current-slide">{currentSlide + 1}</span>
        <span className="total-slides">/{movies.length}</span>
      </div>
    </div>
  );
};

export default MovieSlider;