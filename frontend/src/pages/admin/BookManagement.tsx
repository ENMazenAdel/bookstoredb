/**
 * ============================================================================
 * BOOK MANAGEMENT PAGE (Admin)
 * ============================================================================
 * 
 * Admin page for managing the book inventory.
 * Provides full CRUD operations for books in the system.
 * 
 * FEATURES:
 * - View all books with search and filter capabilities
 * - Add new books to inventory
 * - Edit existing book details
 * - Delete books from inventory
 * - Quick quantity adjustment (increase/decrease stock)
 * - Low stock highlighting
 * 
 * DATABASE TRIGGERS DEMONSTRATED:
 * - Auto-replenish: When quantity drops below threshold via update,
 *   system automatically creates a publisher order
 * - CHECK constraint: Prevents quantity from going negative
 * 
 * ACCESS: Admin users only (protected by ProtectedRoute)
 * 
 * @author Bookstore Development Team
 * @version 1.0.0
 * ============================================================================
 */

// React imports for component and lifecycle management
import React, { useState, useEffect } from 'react';

// Type imports for TypeScript type safety
import { Book, BookCategory, BookFormData } from '../../types';

// API services for book and publisher operations
import { booksApi, publishersApi } from '../../services/api';

// Shared UI component for loading state
import { LoadingSpinner } from '../../components';

// Icons for visual enhancement
import { FaBook, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Available book categories
 * Must match the BookCategory type defined in types/Book.ts
 */
const categories: BookCategory[] = ['Science', 'Art', 'Religion', 'History', 'Geography'];

/**
 * Empty form data template for resetting the form
 * Used when opening the modal for adding a new book
 */
const emptyFormData: BookFormData = {
  isbn: '',
  title: '',
  authors: '',            // Comma-separated string, converted to array on save
  publisher: '',
  publicationYear: new Date().getFullYear(),
  sellingPrice: 0,
  category: 'Science',
  quantity: 0,
  threshold: 5            // Default reorder threshold
};

/**
 * BookManagement Component
 * 
 * Renders the book management interface with:
 * - Search and filter controls
 * - Books table with CRUD actions
 * - Modal form for add/edit operations
 */
const BookManagement: React.FC = () => {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // Data state
  const [books, setBooks] = useState<Book[]>([]);              // All books from API
  const [publishers, setPublishers] = useState<string[]>([]);  // Publisher names for dropdown
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);            // Initial load state
  const [showModal, setShowModal] = useState(false);           // Modal visibility
  const [editingBook, setEditingBook] = useState<Book | null>(null); // Book being edited
  
  // Form state
  const [formData, setFormData] = useState<BookFormData>(emptyFormData);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');          // Search text
  const [filterCategory, setFilterCategory] = useState('');    // Category filter
  
  // Feedback state
  const [error, setError] = useState('');                      // Error message
  const [success, setSuccess] = useState('');                  // Success message
  const [isSaving, setIsSaving] = useState(false);            // Form submission state

  // ========================================
  // DATA LOADING
  // ========================================
  
  /**
   * Effect: Load initial data on component mount
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Loads books and publishers data from APIs
   * Uses Promise.all for parallel fetching
   */
  const loadData = async () => {
    try {
      const [booksData, publishersData] = await Promise.all([
        booksApi.getAll(),
        publishersApi.getAll()
      ]);
      setBooks(booksData);
      // Extract publisher names for the dropdown
      setPublishers(publishersData.map(p => p.name));
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // FILTERING LOGIC
  // ========================================
  
  /**
   * Filters books based on search query and category filter
   * Search matches against: title, ISBN, and authors
   */
  const filteredBooks = books.filter(book => {
    // Check if book matches search query
    const matchesSearch = !searchQuery || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Check if book matches category filter
    const matchesCategory = !filterCategory || book.category === filterCategory;
    
    // Book must match both criteria
    return matchesSearch && matchesCategory;
  });

  // ========================================
  // MODAL HANDLERS
  // ========================================

  /**
   * Opens the add/edit modal
   * @param book - If provided, opens in edit mode; otherwise opens in add mode
   */
  const handleOpenModal = (book?: Book) => {
    if (book) {
      // Edit mode: populate form with existing book data
      setEditingBook(book);
      setFormData({
        isbn: book.isbn,
        title: book.title,
        authors: book.authors.join(', '),  // Convert array to comma-separated string
        publisher: book.publisher,
        publicationYear: book.publicationYear,
        sellingPrice: book.sellingPrice,
        category: book.category,
        quantity: book.quantity,
        threshold: book.threshold
      });
    } else {
      // Add mode: reset form to empty state
      setEditingBook(null);
      setFormData(emptyFormData);
    }
    setError('');
    setShowModal(true);
  };

  /**
   * Closes the modal and resets form state
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBook(null);
    setFormData(emptyFormData);
    setError('');
  };

  // ========================================
  // FORM HANDLERS
  // ========================================

  /**
   * Handles form input changes
   * Converts numeric fields to numbers
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      // Parse numeric fields, keep others as strings
      [name]: ['publicationYear', 'sellingPrice', 'quantity', 'threshold'].includes(name)
        ? parseFloat(value) || 0
        : value
    }));
  };

  /**
   * Handles form submission for add/edit operations
   * Converts authors string to array before saving
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      if (editingBook) {
        // Update existing book
        await booksApi.update(editingBook.isbn, {
          ...formData,
          authors: formData.authors.split(',').map(a => a.trim())
        });
        setSuccess('Book updated successfully!');
      } else {
        // Add new book
        await booksApi.add(formData);
        setSuccess('Book added successfully!');
      }
      // Refresh data and close modal
      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save book');
    } finally {
      setIsSaving(false);
    }
  };

  // ========================================
  // ACTION HANDLERS
  // ========================================

  /**
   * Handles book deletion with confirmation
   */
  const handleDelete = async (isbn: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
      await booksApi.delete(isbn);
      setSuccess('Book deleted successfully!');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete book');
    }
  };

  /**
   * Updates book quantity (for quick stock adjustments)
   * Triggers auto-replenish if quantity drops below threshold
   * 
   * @param book - The book to update
   * @param change - Positive to add stock, negative to reduce (sale)
   */
  const handleUpdateQuantity = async (book: Book, change: number) => {
    const newQuantity = book.quantity + change;
    
    // Validate: cannot have negative stock
    if (newQuantity < 0) {
      setError('Cannot reduce quantity below zero');
      return;
    }
    
    try {
      // This may trigger auto-replenish if crossing threshold
      await booksApi.update(book.isbn, { quantity: newQuantity });
      setSuccess(`Quantity updated. ${change < 0 ? 'Sale recorded.' : 'Stock added.'}`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading books..." />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <FaBook className="me-2" />
          Book Management
        </h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <FaPlus className="me-1" />
          Add New Book
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title, ISBN, or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => { setSearchQuery(''); setFilterCategory(''); }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>ISBN</th>
                  <th>Title</th>
                  <th>Author(s)</th>
                  <th>Category</th>
                  <th className="text-end">Price</th>
                  <th className="text-center">Stock</th>
                  <th className="text-center">Threshold</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map(book => (
                  <tr key={book.isbn}>
                    <td><small>{book.isbn}</small></td>
                    <td>{book.title}</td>
                    <td><small>{book.authors.join(', ')}</small></td>
                    <td>
                      <span className="badge bg-secondary">{book.category}</span>
                    </td>
                    <td className="text-end">${book.sellingPrice.toFixed(2)}</td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleUpdateQuantity(book, -1)}
                          disabled={book.quantity === 0}
                          title="Record Sale"
                        >
                          -
                        </button>
                        <span className="btn btn-outline-secondary disabled">
                          {book.quantity}
                        </span>
                        <button
                          className="btn btn-outline-success"
                          onClick={() => handleUpdateQuantity(book, 1)}
                          title="Add Stock"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-center">{book.threshold}</td>
                    <td>
                      {book.quantity === 0 ? (
                        <span className="badge bg-danger">Out of Stock</span>
                      ) : book.quantity < book.threshold ? (
                        <span className="badge bg-warning text-dark">Low Stock</span>
                      ) : (
                        <span className="badge bg-success">In Stock</span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleOpenModal(book)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(book.isbn)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredBooks.length === 0 && (
            <p className="text-center text-muted py-3">No books found</p>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && <div className="alert alert-danger">{error}</div>}
                  
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">ISBN *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleChange}
                        disabled={!!editingBook}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-select"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Author(s) *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="authors"
                        value={formData.authors}
                        onChange={handleChange}
                        placeholder="Separate multiple authors with commas"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Publisher *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleChange}
                        list="publishers-list"
                        required
                      />
                      <datalist id="publishers-list">
                        {publishers.map(pub => (
                          <option key={pub} value={pub} />
                        ))}
                      </datalist>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Publication Year *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="publicationYear"
                        value={formData.publicationYear}
                        onChange={handleChange}
                        min="1900"
                        max={new Date().getFullYear()}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Selling Price ($) *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="sellingPrice"
                        value={formData.sellingPrice}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Initial Quantity *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Threshold *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="threshold"
                        value={formData.threshold}
                        onChange={handleChange}
                        min="1"
                        required
                      />
                      <small className="text-muted">Minimum stock before reorder</small>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Saving...
                      </>
                    ) : (
                      editingBook ? 'Update Book' : 'Add Book'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagement;
