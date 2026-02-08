import React, { useState } from 'react';
import './SeriesFilter.css';

const SeriesFilter = ({
  genres,
  years,
  sortOptions,
  selectedGenre,
  selectedYear,
  selectedSort,
  onGenreChange,
  onYearChange,
  onSortChange,
  onSearch,
  searchQuery
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    onSearch(value);
  };

  const handleGenreClick = (genre) => {
    const genreValue = genre.toLowerCase() === 'all' ? 'all' : genre;
    onGenreChange(genreValue);
  };

  const handleYearClick = (year) => {
    const yearValue = year.toLowerCase().replace(' & ', '').replace(' ', '').toLowerCase();
    onYearChange(yearValue);
  };

  const handleSortClick = (sort) => {
    const sortValue = sort.toLowerCase().replace(' ', '-');
    onSortChange(sortValue);
  };

  return (
    <div className="series-filter">
      <div className="filter-header">
        <h2 className="filter-title">Browse Series</h2>
        <button 
          className="filter-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
          <span className="toggle-icon">{isExpanded ? '↑' : '↓'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-filter">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search series by title, genre, or description..."
            value={localSearch}
            onChange={handleSearchChange}
            className="search-input"
          />
          {localSearch && (
            <button 
              className="clear-search"
              onClick={() => {
                setLocalSearch('');
                onSearch('');
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className={`filter-sections ${isExpanded ? 'expanded' : ''}`}>
        {/* Genre Filter */}
        <div className="filter-section">
          <h3 className="section-title">
            <span className="section-icon">🎭</span>
            Genre
          </h3>
          <div className="filter-options">
            {genres.map((genre) => (
              <button
                key={genre}
                className={`filter-option ${
                  (genre.toLowerCase() === 'all' && selectedGenre === 'all') ||
                  genre === selectedGenre ? 'active' : ''
                }`}
                onClick={() => handleGenreClick(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Year Filter */}
        <div className="filter-section">
          <h3 className="section-title">
            <span className="section-icon">📅</span>
            Release Year
          </h3>
          <div className="filter-options">
            {years.map((year) => (
              <button
                key={year}
                className={`filter-option ${
                  (year.toLowerCase() === 'all' && selectedYear === 'all') ||
                  year.toLowerCase().replace(' & ', '').replace(' ', '') === selectedYear ? 'active' : ''
                }`}
                onClick={() => handleYearClick(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-section">
          <h3 className="section-title">
            <span className="section-icon">📊</span>
            Sort By
          </h3>
          <div className="filter-options">
            {sortOptions.map((option) => (
              <button
                key={option}
                className={`filter-option ${
                  option.toLowerCase().replace(' ', '-') === selectedSort ? 'active' : ''
                }`}
                onClick={() => handleSortClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Filters */}
        <div className="filter-section">
          <h3 className="section-title">
            <span className="section-icon">⚡</span>
            Quick Filters
          </h3>
          <div className="quick-filters">
            <button className="quick-filter">
              <span className="quick-icon">🔥</span>
              Trending
            </button>
            <button className="quick-filter">
              <span className="quick-icon">🆕</span>
              New Releases
            </button>
            <button className="quick-filter">
              <span className="quick-icon">🏆</span>
              Top Rated
            </button>
            <button className="quick-filter">
              <span className="quick-icon">👨‍👩‍👧‍👦</span>
              Family Friendly
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="active-filters">
          <h4 className="active-title">Active Filters:</h4>
          <div className="active-tags">
            {selectedGenre !== 'all' && (
              <span className="active-tag">
                Genre: {selectedGenre}
                <button 
                  className="remove-tag"
                  onClick={() => onGenreChange('all')}
                >
                  ✕
                </button>
              </span>
            )}
            {selectedYear !== 'all' && (
              <span className="active-tag">
                Year: {selectedYear}
                <button 
                  className="remove-tag"
                  onClick={() => onYearChange('all')}
                >
                  ✕
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="active-tag">
                Search: "{searchQuery}"
                <button 
                  className="remove-tag"
                  onClick={() => {
                    setLocalSearch('');
                    onSearch('');
                  }}
                >
                  ✕
                </button>
              </span>
            )}
            {(selectedGenre !== 'all' || selectedYear !== 'all' || searchQuery) && (
              <button 
                className="clear-all"
                onClick={() => {
                  onGenreChange('all');
                  onYearChange('all');
                  setLocalSearch('');
                  onSearch('');
                }}
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesFilter;