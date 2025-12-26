/**
 * ============================================================================
 * BROWSE BOOKS PAGE (Customer)
 * ============================================================================
 * 
 * Main page for browsing the bookstore catalog.
 * Available to all users (customers and admins).
 * 
 * FEATURES:
 * 1. Search books by title, ISBN, or author
 * 2. Filter by category, author, or publisher
 * 3. Sort by title, price, or publication year
 * 4. Toggle between grid and list view
 * 5. Add to cart functionality (customers only)
 * 
 * FILTERING LOGIC:
 * - All filters work together (AND logic)
 * - Search query matches title, ISBN, or any author
 * - Category filter is passed via URL parameter
 * - Filters are cleared with a single button
 * 
 * SORTING OPTIONS:
 * - By title (alphabetical)
 * - By price (ascending or descending)
 * - By year (newest first)
 * 
 * VIEW MODES:
 * - Grid: Shows BookCard components in a responsive grid
 * - List: Shows detailed horizontal cards with more info
 * 
 * @author Bookstore Development Team
 * @version 1.0.0
 * ============================================================================
 */

// React imports for component and state management
import React, { useState, useEffect } from 'react';

// Router hooks for URL parameters and navigation
import { useSearchParams, useNavigate } from 'react-router-dom';

// Type imports
import { Book, BookCategory } from '../../types';

// API service for fetching books
import { booksApi } from '../../services/api';

// Reusable UI components
import { BookCard, LoadingSpinner } from '../../components';

// Icons for visual enhancement
import { FaSearch, FaTh, FaList, FaShoppingCart } from 'react-icons/fa';

// Context hooks for authentication and cart
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

/** Available book categories for filtering */
const categories: BookCategory[] = ['Science', 'Art', 'Religion', 'History', 'Geography'];

/**
 * BrowseBooks Component
 * 
 * Displays a searchable, filterable catalog of books.
 * Supports grid and list views with add-to-cart functionality.
 */
const BrowseBooks: React.FC = () => {
  // ========================================
  // HOOKS AND URL PARAMETERS
  // ========================================
  
  // URL search parameters for deep linking (e.g., ?category=Science)
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Navigation hook for redirecting to login
  const navigate = useNavigate();
  
  // Auth context for checking if user can add to cart
  const { user, isAuthenticated } = useAuth();
  
  // Cart context for add to cart functionality
  const { addToCart } = useCart();

  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // Book data state
  const [books, setBooks] = useState<Book[]>([]);                    // All books from API
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);    // Books after filtering
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);                  // Loading indicator
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Display mode
  const [addingToCart, setAddingToCart] = useState<string | null>(null); // ISBN being added

  // Filter state - initialized from URL params if present
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedPublisher, setSelectedPublisher] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'price-asc' | 'price-desc' | 'year'>('title');

  // Computed values for filter dropdowns
  // Get unique authors from all books (flattened since authors is an array)
  const uniqueAuthors = [...new Set(books.flatMap(b => b.authors))].sort();
  // Get unique publishers from all books
  const uniquePublishers = [...new Set(books.map(b => b.publisher))].sort();

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
   * Effect: Re-filter books when any filter changes
   * Depends on all filter state variables
   */
  useEffect(() => {
    filterAndSortBooks();
  }, [books, searchQuery, selectedCategory, selectedAuthor, selectedPublisher, sortBy]);

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
  // FILTERING AND SORTING LOGIC
  // ========================================

  /**
   * Applies all filters and sorting to the books array
   * Called whenever any filter state changes
   */
  const filterAndSortBooks = () => {
    let result = [...books];

    // Apply search filter - matches title, ISBN, or author name
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.isbn.toLowerCase().includes(query) ||
        book.authors.some(a => a.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(book => book.category === selectedCategory);
    }

    // Apply author filter
    if (selectedAuthor) {
      result = result.filter(book => book.authors.includes(selectedAuthor));
    }

    // Apply publisher filter
    if (selectedPublisher) {
      result = result.filter(book => book.publisher === selectedPublisher);
    }

    // Apply sorting based on selected option
    switch (sortBy) {
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'price-asc':
        result.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.sellingPrice - a.sellingPrice);
        break;
      case 'year':
        result.sort((a, b) => b.publicationYear - a.publicationYear);
        break;
    }

    setFilteredBooks(result);
  };

  /**
   * Resets all filters to default values
   */
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedAuthor('');
    setSelectedPublisher('');
    setSortBy('title');
    setSearchParams({});  // Clear URL parameters
  };

  /**
   * Handles category change and updates URL
   * @param category - Selected category or empty string for all
   */
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Update URL for deep linking
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  // ========================================
  // CART HANDLERS
  // ========================================

  /**
   * Adds a book to the shopping cart
   * Redirects to login if user is not authenticated
   * @param isbn - ISBN of the book to add
   */
  const handleAddToCart = async (isbn: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setAddingToCart(isbn);  // Show loading state on button
    try {
      await addToCart(isbn);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  // ========================================
  // RENDER
  // ========================================

  // Show loading spinner while fetching books
  if (isLoading) {
    return <LoadingSpinner message="Loading books..." />;
  }

  // Color scheme for category badges
  const categoryColors: { [key: string]: { bg: string; color: string } } = {
    'Science': { bg: 'rgba(239, 68, 68, 0.15)', color: '#dc2626' },
    'Art': { bg: 'rgba(245, 158, 11, 0.15)', color: '#d97706' },
    'Religion': { bg: 'rgba(139, 92, 246, 0.15)', color: '#7c3aed' },
    'History': { bg: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' },
    'Geography': { bg: 'rgba(217, 70, 239, 0.15)', color: '#d946ef' }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div className="container py-5">
        <div className="row">
          {/* ========== SIDEBAR FILTERS ========== */}
          <div className="col-lg-3 mb-4">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div className="card-header border-0 py-4" style={{
                background: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)'
              }}>
                <h5 className="mb-0 text-white fw-bold">Filters</h5>
              </div>
              <div className="card-body p-4">
                {/* Search */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: '#475569' }}>Search</label>
                  <div className="input-group">
                    <span className="input-group-text border-0" style={{
                      backgroundColor: '#f1f5f9',
                      borderRadius: '10px 0 0 10px',
                      color: '#94a3b8'
                    }}>
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control border-0"
                      placeholder="Title, ISBN, Author..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        backgroundColor: '#f1f5f9',
                        borderRadius: '0 10px 10px 0'
                      }}
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: '#475569' }}>Category</label>
                  <select
                    className="form-select border-0"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    style={{ backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '12px' }}
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Author */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: '#475569' }}>Author</label>
                  <select
                    className="form-select border-0"
                    value={selectedAuthor}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    style={{ backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '12px' }}
                  >
                    <option value="">All Authors</option>
                    {uniqueAuthors.map(author => (
                      <option key={author} value={author}>{author}</option>
                    ))}
                  </select>
                </div>

                {/* Publisher */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: '#475569' }}>Publisher</label>
                  <select
                    className="form-select border-0"
                    value={selectedPublisher}
                    onChange={(e) => setSelectedPublisher(e.target.value)}
                    style={{ backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '12px' }}
                  >
                    <option value="">All Publishers</option>
                    {uniquePublishers.map(pub => (
                      <option key={pub} value={pub}>{pub}</option>
                    ))}
                  </select>
                </div>

                <button
                  className="btn w-100 py-3 fw-semibold"
                  onClick={clearFilters}
                  style={{
                    backgroundColor: 'rgba(244, 63, 94, 0.1)',
                    color: '#f43f5e',
                    borderRadius: '10px',
                    border: 'none'
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {/* Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded-4 shadow-sm">
              <div>
                <span style={{ color: '#64748b' }}>
                  Showing <strong style={{ color: '#f43f5e' }}>{filteredBooks.length}</strong> of {books.length} books
                </span>
              </div>
              <div className="d-flex gap-3 align-items-center">
                <select
                  className="form-select border-0"
                  style={{ width: 'auto', backgroundColor: '#f1f5f9', borderRadius: '10px' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                >
                  <option value="title">Sort by Title</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="year">Newest First</option>
                </select>
                <div className="btn-group">
                  <button
                    className={`btn ${viewMode === 'grid' ? '' : 'btn-outline-secondary'}`}
                    onClick={() => setViewMode('grid')}
                    style={{
                      backgroundColor: viewMode === 'grid' ? '#f43f5e' : 'transparent',
                      color: viewMode === 'grid' ? 'white' : '#64748b',
                      border: viewMode === 'grid' ? 'none' : '1px solid #e2e8f0',
                      borderRadius: '10px 0 0 10px'
                    }}
                  >
                    <FaTh />
                  </button>
                  <button
                    className={`btn ${viewMode === 'list' ? '' : 'btn-outline-secondary'}`}
                    onClick={() => setViewMode('list')}
                    style={{
                      backgroundColor: viewMode === 'list' ? '#f43f5e' : 'transparent',
                      color: viewMode === 'list' ? 'white' : '#64748b',
                      border: viewMode === 'list' ? 'none' : '1px solid #e2e8f0',
                      borderRadius: '0 10px 10px 0'
                    }}
                  >
                    <FaList />
                  </button>
                </div>
              </div>
            </div>

            {/* Books Grid/List */}
            {filteredBooks.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
                <h4 style={{ color: '#1e293b' }}>No books found</h4>
                <p style={{ color: '#64748b' }}>Try adjusting your filters or search terms.</p>
                <button
                  className="btn px-4 py-2 text-white fw-semibold"
                  onClick={clearFilters}
                  style={{
                    background: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)',
                    borderRadius: '10px',
                    border: 'none'
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                {filteredBooks.map(book => (
                  <div className="col" key={book.isbn}>
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {filteredBooks.map(book => (
                  <div key={book.isbn} className="bg-white p-4 rounded-4 shadow-sm">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <img
                          src={book.imageUrl || `https://via.placeholder.com/100x130/f43f5e/ffffff?text=Book`}
                          alt={book.title}
                          style={{ width: '100px', height: '130px', objectFit: 'cover', borderRadius: '12px' }}
                        />
                      </div>
                      <div className="col">
                        <span
                          className="badge mb-2 rounded-pill"
                          style={{
                            backgroundColor: categoryColors[book.category]?.bg || 'rgba(244, 63, 94, 0.1)',
                            color: categoryColors[book.category]?.color || '#f43f5e'
                          }}
                        >
                          {book.category}
                        </span>
                        <h5 className="mb-1 fw-bold" style={{ color: '#1e293b' }}>{book.title}</h5>
                        <p className="mb-1" style={{ color: '#64748b' }}>
                          {book.authors.join(', ')} • {book.publisher} • {book.publicationYear}
                        </p>
                        <span
                          className="badge rounded-pill"
                          style={{
                            backgroundColor: book.quantity > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: book.quantity > 0 ? '#059669' : '#dc2626'
                          }}
                        >
                          {book.quantity > 0 ? `${book.quantity} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      <div className="col-auto text-end">
                        <p className="h4 mb-3 fw-bold" style={{ color: '#f43f5e' }}>${book.sellingPrice.toFixed(2)}</p>
                        {(!user || user.role === 'customer') && (
                          <button
                            className="btn px-4 py-2 text-white fw-semibold"
                            onClick={() => handleAddToCart(book.isbn)}
                            disabled={book.quantity === 0 || addingToCart === book.isbn}
                            style={{
                              background: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)',
                              borderRadius: '10px',
                              border: 'none',
                              opacity: book.quantity === 0 ? 0.5 : 1
                            }}
                          >
                            {addingToCart === book.isbn ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              <><FaShoppingCart className="me-2" /> Add to Cart</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseBooks;
