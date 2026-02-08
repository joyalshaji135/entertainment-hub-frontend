import React, { useState, useEffect } from 'react';
import './SeriesPage.css';
import SeriesFilter from '../../components/SeriesFilter/SeriesFilter';
import SeriesCard from '../../components/SeriesCard/SeriesCard';

const SeriesPage = () => {
  const [series, setSeries] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 12;

  // Sample series data
  const seriesData = [
    {
      id: 1,
      title: "Stranger Things",
      year: 2016,
      rating: 8.7,
      seasons: 4,
      episodes: 34,
      genre: ["Sci-Fi", "Horror", "Drama"],
      description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
      image: "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?w=400",
      poster: "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?w=800",
      isFeatured: true,
      isNew: false,
      status: "Ongoing",
      network: "Netflix",
      cast: ["Millie Bobby Brown", "Finn Wolfhard", "Winona Ryder"],
      trailer: "https://www.youtube.com/watch?v=b9EkMc79ZSU",
      imdb: "tt4574334"
    },
    {
      id: 2,
      title: "Game of Thrones",
      year: 2011,
      rating: 9.2,
      seasons: 8,
      episodes: 73,
      genre: ["Fantasy", "Drama", "Adventure"],
      description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
      image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400",
      poster: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=800",
      isFeatured: true,
      isNew: false,
      status: "Ended",
      network: "HBO",
      cast: ["Emilia Clarke", "Kit Harington", "Peter Dinklage"],
      trailer: "https://www.youtube.com/watch?v=rlR4PJn8b8I",
      imdb: "tt0944947"
    },
    {
      id: 3,
      title: "The Mandalorian",
      year: 2019,
      rating: 8.7,
      seasons: 3,
      episodes: 24,
      genre: ["Sci-Fi", "Action", "Adventure"],
      description: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400",
      poster: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      isFeatured: true,
      isNew: true,
      status: "Ongoing",
      network: "Disney+",
      cast: ["Pedro Pascal", "Gina Carano", "Carl Weathers"],
      trailer: "https://www.youtube.com/watch?v=eW7Twd85m2g",
      imdb: "tt8111088"
    },
    {
      id: 4,
      title: "Breaking Bad",
      year: 2008,
      rating: 9.5,
      seasons: 5,
      episodes: 62,
      genre: ["Crime", "Drama", "Thriller"],
      description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
      poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
      isFeatured: true,
      isNew: false,
      status: "Ended",
      network: "AMC",
      cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn"],
      trailer: "https://www.youtube.com/watch?v=HhesaQXLuRY",
      imdb: "tt0903747"
    },
    {
      id: 5,
      title: "The Crown",
      year: 2016,
      rating: 8.6,
      seasons: 5,
      episodes: 50,
      genre: ["Drama", "History"],
      description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400",
      poster: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
      isFeatured: false,
      isNew: false,
      status: "Ended",
      network: "Netflix",
      cast: ["Claire Foy", "Olivia Colman", "Matt Smith"],
      trailer: "https://www.youtube.com/watch?v=JWtnJjn6ng0",
      imdb: "tt4786824"
    },
    {
      id: 6,
      title: "The Witcher",
      year: 2019,
      rating: 8.2,
      seasons: 3,
      episodes: 24,
      genre: ["Fantasy", "Action", "Adventure"],
      description: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
      poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
      isFeatured: true,
      isNew: true,
      status: "Ongoing",
      network: "Netflix",
      cast: ["Henry Cavill", "Anya Chalotra", "Freya Allan"],
      trailer: "https://www.youtube.com/watch?v=ndl1W4ltcmg",
      imdb: "tt5180504"
    },
    {
      id: 7,
      title: "Friends",
      year: 1994,
      rating: 8.9,
      seasons: 10,
      episodes: 236,
      genre: ["Comedy", "Romance"],
      description: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.",
      image: "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?w=400",
      poster: "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?w=800",
      isFeatured: false,
      isNew: false,
      status: "Ended",
      network: "NBC",
      cast: ["Jennifer Aniston", "Courteney Cox", "Lisa Kudrow"],
      trailer: "https://www.youtube.com/watch?v=IEEbUzffzrk",
      imdb: "tt0108778"
    },
    {
      id: 8,
      title: "The Office",
      year: 2005,
      rating: 9.0,
      seasons: 9,
      episodes: 201,
      genre: ["Comedy"],
      description: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
      image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400",
      poster: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=800",
      isFeatured: true,
      isNew: false,
      status: "Ended",
      network: "NBC",
      cast: ["Steve Carell", "John Krasinski", "Jenna Fischer"],
      trailer: "https://www.youtube.com/watch?v=LHOtME2DL4g",
      imdb: "tt0386676"
    },
    {
      id: 9,
      title: "Loki",
      year: 2021,
      rating: 8.3,
      seasons: 2,
      episodes: 12,
      genre: ["Sci-Fi", "Action", "Adventure"],
      description: "The mercurial villain Loki resumes his role as the God of Mischief in a new series that takes place after the events of Avengers: Endgame.",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400",
      poster: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      isFeatured: true,
      isNew: true,
      status: "Ongoing",
      network: "Disney+",
      cast: ["Tom Hiddleston", "Sophia Di Martino", "Owen Wilson"],
      trailer: "https://www.youtube.com/watch?v=nW948Va-l10",
      imdb: "tt9140554"
    },
    {
      id: 10,
      title: "Wednesday",
      year: 2022,
      rating: 8.1,
      seasons: 1,
      episodes: 8,
      genre: ["Comedy", "Horror", "Fantasy"],
      description: "Follows Wednesday Addams' years as a student, when she attempts to master her emerging psychic ability, thwart a killing spree, and solve the mystery.",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
      poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
      isFeatured: true,
      isNew: true,
      status: "Ongoing",
      network: "Netflix",
      cast: ["Jenna Ortega", "Gwendoline Christie", "Riki Lindhome"],
      trailer: "https://www.youtube.com/watch?v=Di310WS8zLk",
      imdb: "tt13443470"
    },
    {
      id: 11,
      title: "The Last of Us",
      year: 2023,
      rating: 8.8,
      seasons: 1,
      episodes: 9,
      genre: ["Drama", "Horror", "Sci-Fi"],
      description: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope.",
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400",
      poster: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
      isFeatured: true,
      isNew: true,
      status: "Ongoing",
      network: "HBO",
      cast: ["Pedro Pascal", "Bella Ramsey", "Anna Torv"],
      trailer: "https://www.youtube.com/watch?v=uLtkt8BonwM",
      imdb: "tt3581920"
    },
    {
      id: 12,
      title: "Peaky Blinders",
      year: 2013,
      rating: 8.8,
      seasons: 6,
      episodes: 36,
      genre: ["Crime", "Drama"],
      description: "A gangster family epic set in 1919 Birmingham, England; centered on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.",
      image: "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?w=400",
      poster: "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?w=800",
      isFeatured: true,
      isNew: false,
      status: "Ended",
      network: "BBC",
      cast: ["Cillian Murphy", "Paul Anderson", "Helen McCrory"],
      trailer: "https://www.youtube.com/watch?v=oVzVdvGIC7U",
      imdb: "tt2442560"
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchSeries = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSeries(seriesData);
      setFilteredSeries(seriesData);
      setLoading(false);
    };

    fetchSeries();
  }, []);

  useEffect(() => {
    let results = [...series];

    // Filter by search query
    if (searchQuery) {
      results = results.filter(series =>
        series.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        series.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        series.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by genre
    if (selectedGenre !== 'all') {
      results = results.filter(series => series.genre.includes(selectedGenre));
    }

    // Filter by year
    if (selectedYear !== 'all') {
      const year = parseInt(selectedYear);
      if (selectedYear.includes('2020')) {
        results = results.filter(series => series.year >= 2020);
      } else if (selectedYear.includes('2010')) {
        results = results.filter(series => series.year >= 2010 && series.year < 2020);
      } else if (selectedYear === '2000s') {
        results = results.filter(series => series.year >= 2000 && series.year < 2010);
      } else if (selectedYear === '90s') {
        results = results.filter(series => series.year >= 1990 && series.year < 2000);
      }
    }

    // Sort results
    switch (selectedSort) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'year-new':
        results.sort((a, b) => b.year - a.year);
        break;
      case 'year-old':
        results.sort((a, b) => a.year - b.year);
        break;
      case 'title':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'popular':
      default:
        results.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
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

  const genres = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Sci-Fi', 'Crime', 'Thriller', 'Romance'];
  const years = ['All', '2020s', '2010s', '2000s', '90s & Older'];
  const sortOptions = ['Popular', 'Rating', 'Newest', 'Oldest', 'Title'];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading series...</p>
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
              <div className="stat-number">1,000+</div>
              <div className="stat-label">Series</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Networks</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
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
        />

        {/* Series Grid */}
        <div className="series-grid">
          {paginatedSeries.length > 0 ? (
            paginatedSeries.map((series) => (
              <SeriesCard key={series.id} series={series} />
            ))
          ) : (
            <div className="no-results">
              <div className="no-results-icon">📺</div>
              <h3>No series found</h3>
              <p>Try adjusting your filters or search terms</p>
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

        {/* Featured Networks */}
        <div className="featured-networks">
          <h3 className="networks-title">Available on</h3>
          <div className="networks-grid">
            {['Netflix', 'HBO', 'Disney+', 'Amazon Prime', 'Hulu', 'Apple TV+'].map((network) => (
              <div key={network} className="network-logo">
                <span className="network-icon">📺</span>
                <span className="network-name">{network}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesPage;