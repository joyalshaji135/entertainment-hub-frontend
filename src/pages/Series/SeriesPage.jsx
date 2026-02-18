// pages/Series/SeriesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const itemsPerPage = 12;
  
  const { isAuthenticated, user } = useAuth();

  // Extract all unique genres from series data
  const getAllGenres = (seriesData) => {
    if (!seriesData || !Array.isArray(seriesData)) return ['All'];
    
    const genreSet = new Set();
    seriesData.forEach(show => {
      if (show.genre && Array.isArray(show.genre)) {
        show.genre.forEach(genre => genreSet.add(genre));
      }
    });
    return ['All', ...Array.from(genreSet).sort()];
  };

  // Extract years from series data
  const getYearRange = (seriesData) => {
    if (!seriesData || !Array.isArray(seriesData)) return ['All'];
    
    const years = seriesData.map(show => {
      if (!show.year) return null;
      const yearStr = show.year.toString();
      if (yearStr.includes('-')) {
        return parseInt(yearStr.split('-')[0]);
      }
      return parseInt(yearStr);
    }).filter(year => year && !isNaN(year));
    
    if (years.length === 0) return ['All'];
    
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    
    const yearRanges = ['All'];
    
    // Create decade ranges
    for (let year = maxYear; year >= minYear; year -= 10) {
      const decadeStart = Math.floor(year / 10) * 10;
      yearRanges.push(`${decadeStart}s`);
    }
    
    return [...new Set(yearRanges)]; // Remove duplicates
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWishlist();
    }
  }, [isAuthenticated, user]);

  const API_KEY = import.meta.env.VITE_API_KEY;

  const fetchSeries = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://imdb-top-100-movies.p.rapidapi.com/series/', {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'imdb-top-100-movies.p.rapidapi.com',
          'x-rapidapi-key': API_KEY
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch series');
      }

      const data = await response.json();
      
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      
      // Enhance series data with additional properties
      const enhancedData = data.map((show, index) => {
        if (!show) return null;
        
        return {
          ...show,
          id: show.id || show._id || `series-${index}`,
          seasons: extractSeasons(show.year),
          episodes: extractEpisodes(show.year),
          status: determineStatus(show.year),
          network: extractNetwork(show),
          cast: [],
          isFeatured: show.rank && show.rank <= 10,
          isNew: isNewSeries(show.year),
          sourceType: 'series',
          title: show.title || 'Unknown Title',
          description: show.description || 'No description available',
          genre: show.genre || [],
          rating: show.rating || 0,
          year: show.year || 'Unknown',
          image: show.image || 'https://via.placeholder.com/300x450?text=No+Image',
          rank: show.rank || 999
        };
      }).filter(show => show !== null); // Remove null entries

      setSeries(enhancedData);
      setFilteredSeries(enhancedData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching series:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
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
        setWishlistItems(data.data);
      } else if (Array.isArray(data)) {
        setWishlistItems(data);
      } else {
        setWishlistItems([]);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  const addToWishlist = async (seriesItem) => {
    if (!isAuthenticated || !user) {
      showNotification('Please login to add to wishlist', 'error');
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
          sourceId: seriesItem.id,
          sourceType: 'series',
          title: seriesItem.title,
          image: seriesItem.image,
          rating: seriesItem.rating,
          year: seriesItem.year,
          rank: seriesItem.rank,
          genre: seriesItem.genre,
          seasons: seriesItem.seasons,
          status: seriesItem.status
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to wishlist');
      }

      if (data.status === 'success') {
        await fetchWishlist();
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

  const removeFromWishlist = async (seriesId) => {
    if (!isAuthenticated || !user) {
      showNotification('Please login to manage wishlist', 'error');
      return false;
    }

    setWishlistLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      
      // Find the wishlist item ID
      const wishlistItem = wishlistItems.find(item => item.sourceId === seriesId);
      
      if (!wishlistItem) {
        throw new Error('Item not found in wishlist');
      }

      const response = await fetch(`http://localhost:5000/wish-list/remove/${wishlistItem._id}`, {
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
        await fetchWishlist();
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

  const handleWishlistToggle = async (seriesItem, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!seriesItem || !seriesItem.id) {
      showNotification('Invalid series data', 'error');
      return;
    }
    
    const isInWishlist = checkInWishlist(seriesItem.id);
    
    if (isInWishlist) {
      await removeFromWishlist(seriesItem.id);
    } else {
      await addToWishlist(seriesItem);
    }
  };

  const checkInWishlist = (seriesId) => {
    if (!seriesId || !wishlistItems || !Array.isArray(wishlistItems)) return false;
    return wishlistItems.some(item => item.sourceId === seriesId);
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

  // Helper functions to extract additional data
  const extractSeasons = (yearStr) => {
    if (!yearStr) return Math.floor(Math.random() * 5) + 3;
    
    if (typeof yearStr === 'string' && yearStr.includes('-')) {
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
    
    if (typeof yearStr === 'string' && yearStr.includes('-')) {
      const endYear = yearStr.split('-')[1];
      if (endYear && parseInt(endYear) < new Date().getFullYear()) {
        return 'Ended';
      }
      return 'Ongoing';
    }
    const year = parseInt(yearStr);
    return !isNaN(year) && year < new Date().getFullYear() ? 'Ended' : 'Upcoming';
  };

  const extractNetwork = (show) => {
    const networks = ['Netflix', 'HBO', 'Amazon Prime', 'Disney+', 'Hulu', 'Apple TV+', 'BBC', 'NBC', 'AMC'];
    return networks[Math.floor(Math.random() * networks.length)];
  };

  const isNewSeries = (yearStr) => {
    if (!yearStr) return false;
    
    const currentYear = new Date().getFullYear();
    let year;
    
    if (typeof yearStr === 'string' && yearStr.includes('-')) {
      year = parseInt(yearStr.split('-')[0]);
    } else {
      year = parseInt(yearStr);
    }
    
    return !isNaN(year) && year >= currentYear - 2;
  };

  useEffect(() => {
    if (!series || !Array.isArray(series) || series.length === 0) {
      setFilteredSeries([]);
      return;
    }
    
    let results = [...series];

    // Filter by search query
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(show =>
        (show.title && show.title.toLowerCase().includes(query)) ||
        (show.description && show.description.toLowerCase().includes(query)) ||
        (show.genre && show.genre.some(g => g && g.toLowerCase().includes(query)))
      );
    }

    // Filter by genre
    if (selectedGenre && selectedGenre !== 'all') {
      results = results.filter(show => 
        show.genre && show.genre.map(g => g.toLowerCase()).includes(selectedGenre.toLowerCase())
      );
    }

    // Filter by year/decade
    if (selectedYear && selectedYear !== 'all') {
      const decade = parseInt(selectedYear.replace('s', ''));
      if (!isNaN(decade)) {
        results = results.filter(show => {
          if (!show.year) return false;
          let year;
          if (typeof show.year === 'string' && show.year.includes('-')) {
            year = parseInt(show.year.split('-')[0]);
          } else {
            year = parseInt(show.year);
          }
          return !isNaN(year) && year >= decade && year < decade + 10;
        });
      }
    }

    // Sort results
    if (results.length > 0) {
      switch (selectedSort) {
        case 'rating':
          results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'newest':
          results.sort((a, b) => {
            const yearA = getYearValue(a.year);
            const yearB = getYearValue(b.year);
            return yearB - yearA;
          });
          break;
        case 'oldest':
          results.sort((a, b) => {
            const yearA = getYearValue(a.year);
            const yearB = getYearValue(b.year);
            return yearA - yearB;
          });
          break;
        case 'title':
          results.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
          break;
        case 'popular':
        default:
          results.sort((a, b) => (a.rank || 999) - (b.rank || 999));
          break;
      }
    }

    setFilteredSeries(results);
    setCurrentPage(1);
  }, [selectedGenre, selectedYear, selectedSort, searchQuery, series]);

  const getYearValue = (year) => {
    if (!year) return 0;
    if (typeof year === 'string' && year.includes('-')) {
      return parseInt(year.split('-')[0]) || 0;
    }
    return parseInt(year) || 0;
  };

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
            paginatedSeries.map((seriesItem, index) => {
              // Ensure seriesItem has all required properties
              const safeSeriesItem = {
                id: seriesItem?.id || `temp-${index}`,
                title: seriesItem?.title || 'Unknown Title',
                description: seriesItem?.description || 'No description available',
                image: seriesItem?.image || 'https://via.placeholder.com/300x450?text=No+Image',
                rating: seriesItem?.rating || 0,
                year: seriesItem?.year || 'Unknown',
                genre: seriesItem?.genre || [],
                rank: seriesItem?.rank || 999,
                seasons: seriesItem?.seasons || 1,
                episodes: seriesItem?.episodes || 12,
                status: seriesItem?.status || 'Unknown',
                network: seriesItem?.network || 'Unknown',
                imdb_link: seriesItem?.imdb_link || '#',
                imdbid: seriesItem?.imdbid || '',
                trailer: seriesItem?.trailer || null,
                isFeatured: seriesItem?.isFeatured || false,
                isNew: seriesItem?.isNew || false
              };
              
              return (
                <SeriesCard 
                  key={safeSeriesItem.id} 
                  series={safeSeriesItem}
                  isInWishlist={checkInWishlist(seriesItem?.id)}
                  onWishlistToggle={(e) => handleWishlistToggle(seriesItem, e)}
                  wishlistLoading={wishlistLoading}
                  style={{ '--animation-order': index }}
                />
              );
            })
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
        {filteredSeries.length > 0 && (
          <div className="results-info">
            <p>
              Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredSeries.length)} of {filteredSeries.length} series
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesPage;