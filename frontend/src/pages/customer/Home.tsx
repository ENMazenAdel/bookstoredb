/**
 * ============================================================================
 * HOME PAGE (Landing Page)
 * ============================================================================
 * 
 * The main landing page for the bookstore application.
 * Designed to attract and engage visitors with featured content.
 * 
 * SECTIONS:
 * 
 * 1. HERO SECTION
 *    - Welcome message with gradient background
 *    - Search bar for quick book searches
 *    - Call-to-action buttons
 * 
 * 2. CATEGORIES SECTION
 *    - Visual cards for each book category
 *    - Icons and color-coded gradients
 *    - Links to filtered book views
 * 
 * 3. FEATURED BOOKS
 *    - Displays first 4 books as featured
 *    - Uses BookCard component
 *    - Responsive grid layout
 * 
 * FEATURES:
 * - Real-time search filtering
 * - Category quick links
 * - Responsive design
 * - Animated elements
 * 
 * ACCESS: Public (no authentication required)
 * 
 * @author Bookstore Development Team
 * @version 1.0.0
 * ============================================================================
 */

// React imports for component and state management
import React, { useState, useEffect } from 'react';

// Router component for navigation links
import { Link } from 'react-router-dom';

// Type imports
import { Book, BookCategory } from '../../types';

// API service for fetching books
import { booksApi } from '../../services/api';

// Reusable components
import { BookCard, LoadingSpinner } from '../../components';

// Icons for visual enhancement
import { FaSearch, FaBook, FaFlask, FaPalette, FaPray, FaLandmark, FaGlobeAmericas } from 'react-icons/fa';

/** Available book categories */
const categories: BookCategory[] = ['Science', 'Art', 'Religion', 'History', 'Geography'];

/** Icon mapping for each category */
const categoryIcons: { [key: string]: React.ReactNode } = {
  'Science': <FaFlask size={32} />,
  'Art': <FaPalette size={32} />,
  'Religion': <FaPray size={32} />,
  'History': <FaLandmark size={32} />,
  'Geography': <FaGlobeAmericas size={32} />
};

/** Color gradients for category cards */
const categoryColors: { [key: string]: string } = {
  'Science': 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
  'Art': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  'Religion': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  'History': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  'Geography': 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
};

/**
 * Home Component
 * 
 * Landing page with hero, categories, and featured books sections.
 */
const Home: React.FC = () => {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // All books from API
  const [books, setBooks] = useState<Book[]>([]);
  
  // Books filtered by search/category
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Search query from hero section
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // ========================================
  // DATA LOADING
  // ========================================

  /**
   * Effect: Load all books on component mount
   */
  useEffect(() => {
    loadBooks();
  }, []);

  /**
   * Effect: Re-filter books when search or category changes
   */
  useEffect(() => {
    filterBooks();
  }, [books, searchQuery, selectedCategory]);

  /**
   * Loads all books from the API
   */
  const loadBooks = async () => {
    try {
      const data = await booksApi.getAll();
      setBooks(data);
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // FILTERING LOGIC
  // ========================================

  /**
   * Filters books based on search query and selected category
   * Matches against title, ISBN, authors, and publisher
   */
  const filterBooks = () => {
    let result = books;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.isbn.toLowerCase().includes(query) ||
        book.authors.some(a => a.toLowerCase().includes(query)) ||
        book.publisher.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(book => book.category === selectedCategory);
    }

    setFilteredBooks(result);
  };

  /**
   * Handles search form submission
   * Triggers filter (already handled by useEffect)
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterBooks();
  };

  // Get first 4 books as "featured"
  const featuredBooks = books.slice(0, 4);

  // ========================================
  // RENDER
  // ========================================

  // Show loading spinner while fetching
  if (isLoading) {
    return <LoadingSpinner message="Loading books..." />;
  }

  return (
    <div>
      {/* ========== HERO SECTION ========== */}
      <section className="hero-section text-white py-5" style={{ minHeight: '500px' }}>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center py-5">
            <div className="col-lg-6">
              {/* Welcome badge */}
              <span className="badge bg-white text-primary px-3 py-2 mb-3 rounded-pill">
                <FaBook className="me-2" />
                Welcome to BookStore
              </span>
              {/* Hero headline */}
              <h1 className="display-3 fw-bold mb-4" style={{ lineHeight: 1.1 }}>
                Discover Your Next <span style={{ color: '#fbbf24' }}>Great Read</span>
              </h1>
              {/* Hero description */}
              <p className="lead mb-4 opacity-90" style={{ fontSize: '1.25rem' }}>
                Explore our extensive collection of books across Science, Art, History, Religion, and Geography. Find your perfect book today!
              </p>
              {/* CTA buttons */}
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/books" className="btn btn-light btn-lg px-4 py-3 rounded-pill fw-semibold">
                  Browse All Books
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill">
                  Create Account
                </Link>
              </div>
              <div className="mt-4 d-flex gap-4">
                <div>
                  <h3 className="fw-bold mb-0">{books.length}+</h3>
                  <small className="opacity-75">Books Available</small>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">5</h3>
                  <small className="opacity-75">Categories</small>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">24/7</h3>
                  <small className="opacity-75">Support</small>
                </div>
              </div>
            </div>
            <div className="col-lg-6 text-center d-none d-lg-block">
              <div className="position-relative">
                <div className="row g-3">
                  {books.slice(0, 3).map((book, index) => (
                    <div className="col-4" key={book.isbn}>
                      <img
                        src={book.imageUrl || `https://via.placeholder.com/300x400?text=${encodeURIComponent(book.title)}`}
                        alt={book.title}
                        className="img-fluid rounded-3 shadow-lg"
                        style={{
                          transform: `rotate(${index === 1 ? '0' : index === 0 ? '-5' : '5'}deg) translateY(${index === 1 ? '-20px' : '0'})`,
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/300x400/f43f5e/ffffff?text=${encodeURIComponent(book.title.substring(0, 10))}`;
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-5" style={{ marginTop: '-60px', position: 'relative', zIndex: 3 }}>
        <div className="container">
          <div className="search-bar">
            <form onSubmit={handleSearch}>
              <div className="row g-3 align-items-center">
                <div className="col-md-6">
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-white border-0">
                      <FaSearch className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 shadow-none"
                      placeholder="Search by title, ISBN, author, or publisher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select form-select-lg border-0"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill">
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">Featured Books</h2>
              <p className="text-muted mb-0">Hand-picked selections for you</p>
            </div>
            <Link to="/books" className="btn btn-outline-primary rounded-pill px-4">
              View All →
            </Link>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {featuredBooks.map(book => (
              <div className="col" key={book.isbn}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2">Browse by Category</h2>
            <p className="text-muted">Find books in your favorite genre</p>
          </div>
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">
            {categories.map(category => (
              <div className="col" key={category}>
                <Link
                  to={`/books?category=${category}`}
                  className="card h-100 text-decoration-none text-white border-0"
                  style={{ background: categoryColors[category], minHeight: '160px' }}
                >
                  <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
                    <div className="mb-3 opacity-90">
                      {categoryIcons[category]}
                    </div>
                    <h5 className="card-title fw-bold mb-1">{category}</h5>
                    <p className="card-text small opacity-75 mb-0">
                      {books.filter(b => b.category === category).length} books
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Results (if searching) */}
      {(searchQuery || selectedCategory) && (
        <section className="py-5">
          <div className="container">
            <h2 className="mb-4">
              Search Results
              <span className="badge bg-secondary ms-2">{filteredBooks.length}</span>
            </h2>
            {filteredBooks.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No books found matching your criteria.</p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {filteredBooks.map(book => (
                  <div className="col" key={book.isbn}>
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
