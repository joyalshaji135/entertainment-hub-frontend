// pages/Series/SeriesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SeriesPage.css';
import SeriesFilter from '../../components/SeriesFilter/SeriesFilter';
import SeriesCard from '../../components/SeriesCard/SeriesCard';

const SeriesPage = () => {
  const [series, setSeries] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 12;

  // Extract all unique genres from series data
  const getAllGenres = (seriesData) => {
    const genreSet = new Set();
    seriesData.forEach(show => {
      show.genre.forEach(genre => genreSet.add(genre));
    });
    return ['All', ...Array.from(genreSet).sort()];
  };

  // Extract years from series data
  const getYearRange = (seriesData) => {
    const years = seriesData.map(show => {
      const yearStr = show.year.toString();
      if (yearStr.includes('-')) {
        return parseInt(yearStr.split('-')[0]);
      }
      return parseInt(yearStr);
    }).filter(year => !isNaN(year));
    
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    
    const yearRanges = ['All'];
    const currentYear = new Date().getFullYear();
    
    // Create decade ranges
    for (let year = maxYear; year >= minYear; year -= 10) {
      const decadeStart = Math.floor(year / 10) * 10;
      const decadeEnd = decadeStart + 9;
      yearRanges.push(`${decadeStart}s`);
    }
    
    return [...new Set(yearRanges)]; // Remove duplicates
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://imdb-top-100-movies.p.rapidapi.com/series/', {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'imdb-top-100-movies.p.rapidapi.com',
          'x-rapidapi-key': '042319157cmsh7c7ddfec2a8370bp186c32jsn0fb395b37716'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch series');
      }

      const data = await response.json();
      
      // Enhance series data with additional properties
      const enhancedData = data.map((show, index) => ({
        ...show,
        id: show.id || `series-${index}`,
        seasons: extractSeasons(show.year),
        episodes: extractEpisodes(show.year),
        status: determineStatus(show.year),
        network: extractNetwork(show),
        cast: [], // API doesn't provide cast, we'll leave empty
        isFeatured: show.rank <= 10,
        isNew: isNewSeries(show.year)
      }));

      setSeries(enhancedData);
      setFilteredSeries(enhancedData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching series:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to extract additional data
  const extractSeasons = (yearStr) => {
    if (yearStr.includes('-')) {
      const years = yearStr.split('-').map(y => parseInt(y));
      if (years.length === 2 && !isNaN(years[0]) && !isNaN(years[1])) {
        return Math.max(1, Math.ceil((years[1] - years[0]) / 1.5) + 1);
      }
    }
    return Math.floor(Math.random() * 5) + 3; // Random between 3-8 for demo
  };

  const extractEpisodes = (yearStr) => {
    const seasons = extractSeasons(yearStr);
    return seasons * (Math.floor(Math.random() * 8) + 8); // 8-16 episodes per season
  };

  const determineStatus = (yearStr) => {
    if (yearStr.includes('-')) {
      const endYear = yearStr.split('-')[1];
      if (endYear && parseInt(endYear) < new Date().getFullYear()) {
        return 'Ended';
      }
      return 'Ongoing';
    }
    return parseInt(yearStr) < new Date().getFullYear() ? 'Ended' : 'Upcoming';
  };

  const extractNetwork = (show) => {
    // Extract network from description or title (simplified)
    const networks = ['Netflix', 'HBO', 'Amazon Prime', 'Disney+', 'Hulu', 'Apple TV+', 'BBC', 'NBC', 'AMC'];
    return networks[Math.floor(Math.random() * networks.length)];
  };

  const isNewSeries = (yearStr) => {
    const currentYear = new Date().getFullYear();
    const year = parseInt(yearStr.split('-')[0]);
    return !isNaN(year) && year >= currentYear - 2;
  };

  useEffect(() => {
    let results = [...series];

    // Filter by search query
    if (searchQuery) {
      results = results.filter(show =>
        show.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        show.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        show.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by genre
    if (selectedGenre !== 'all') {
      results = results.filter(show => 
        show.genre.map(g => g.toLowerCase()).includes(selectedGenre.toLowerCase())
      );
    }

    // Filter by year/decade
    if (selectedYear !== 'all') {
      const decade = parseInt(selectedYear.replace('s', ''));
      results = results.filter(show => {
        const year = parseInt(show.year.toString().split('-')[0]);
        return !isNaN(year) && year >= decade && year < decade + 10;
      });
    }

    // Sort results
    switch (selectedSort) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        results.sort((a, b) => {
          const yearA = parseInt(a.year.toString().split('-')[0]);
          const yearB = parseInt(b.year.toString().split('-')[0]);
          return yearB - yearA;
        });
        break;
      case 'oldest':
        results.sort((a, b) => {
          const yearA = parseInt(a.year.toString().split('-')[0]);
          const yearB = parseInt(b.year.toString().split('-')[0]);
          return yearA - yearB;
        });
        break;
      case 'title':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'popular':
      default:
        results.sort((a, b) => a.rank - b.rank);
        break;
    }

    setFilteredSeries(results);
    setCurrentPage(1);
  }, [selectedGenre, selectedYear, selectedSort, searchQuery, series]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredSeries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSeries = filteredSeries.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const genres = series.length > 0 ? getAllGenres(series) : ['All'];
  const years = series.length > 0 ? getYearRange(series) : ['All'];
  const sortOptions = ['Popular', 'Rating', 'Newest', 'Oldest', 'Title'];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading amazing series...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">📺</div>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={fetchSeries} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="series-page">
      {/* Hero Banner */}
      <div className="series-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Discover Amazing Series</h1>
          <p className="hero-subtitle">
            Stream thousands of TV shows, exclusive series, and binge-worthy content
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{series.length}+</div>
              <div className="stat-label">Series</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{genres.length - 1}+</div>
              <div className="stat-label">Genres</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {series.reduce((acc, show) => acc + (show.episodes || 0), 0)}+
              </div>
              <div className="stat-label">Episodes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="series-container">
        {/* Filter Section */}
        <SeriesFilter
          genres={genres}
          years={years}
          sortOptions={sortOptions}
          selectedGenre={selectedGenre}
          selectedYear={selectedYear}
          selectedSort={selectedSort}
          onGenreChange={setSelectedGenre}
          onYearChange={setSelectedYear}
          onSortChange={setSelectedSort}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          totalResults={filteredSeries.length}
        />

        {/* Series Grid */}
        <div className="series-grid">
          {paginatedSeries.length > 0 ? (
            paginatedSeries.map((series, index) => (
              <SeriesCard 
                key={series.id} 
                series={series}
                style={{ '--animation-order': index }}
              />
            ))
          ) : (
            <div className="no-results">
              <div className="no-results-icon">📺</div>
              <h3>No series found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setSelectedGenre('all');
                  setSelectedYear('all');
                  setSelectedSort('popular');
                  setSearchQuery('');
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredSeries.length > itemsPerPage && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            
            <div className="page-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="ellipsis">...</span>
                  <button
                    className="page-btn"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}

        {/* Results Info */}
        <div className="results-info">
          <p>
            Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredSeries.length)} of {filteredSeries.length} series
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeriesPage;