import React, { useState, useEffect } from 'react';
import { Book, BookCategory, BookFormData } from '../../types';
import { booksApi, publishersApi } from '../../services/api';
import { LoadingSpinner } from '../../components';
import { FaBook, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const categories: BookCategory[] = ['Science', 'Art', 'Religion', 'History', 'Geography'];

const emptyFormData: BookFormData = {
  isbn: '',
  title: '',
  authors: '',
  publisher: '',
  publicationYear: new Date().getFullYear(),
  sellingPrice: 0,
  category: 'Science',
  quantity: 0,
  threshold: 5
};

const BookManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [publishers, setPublishers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<BookFormData>(emptyFormData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [booksData, publishersData] = await Promise.all([
        booksApi.getAll(),
        publishersApi.getAll()
      ]);
      setBooks(booksData);
      setPublishers(publishersData.map(p => p.name));
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = !searchQuery || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !filterCategory || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        isbn: book.isbn,
        title: book.title,
        authors: book.authors.join(', '),
        publisher: book.publisher,
        publicationYear: book.publicationYear,
        sellingPrice: book.sellingPrice,
        category: book.category,
        quantity: book.quantity,
        threshold: book.threshold
      });
    } else {
      setEditingBook(null);
      setFormData(emptyFormData);
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBook(null);
    setFormData(emptyFormData);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['publicationYear', 'sellingPrice', 'quantity', 'threshold'].includes(name)
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      if (editingBook) {
        await booksApi.update(editingBook.isbn, {
          ...formData,
          authors: formData.authors.split(',').map(a => a.trim())
        });
        setSuccess('Book updated successfully!');
      } else {
        await booksApi.add(formData);
        setSuccess('Book added successfully!');
      }
      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save book');
    } finally {
      setIsSaving(false);
    }
  };

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

  const handleUpdateQuantity = async (book: Book, change: number) => {
    const newQuantity = book.quantity + change;
    if (newQuantity < 0) {
      setError('Cannot reduce quantity below zero');
      return;
    }
    
    try {
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
