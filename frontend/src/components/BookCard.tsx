/**
 * ============================================================================
 * BOOK CARD COMPONENT
 * ============================================================================
 * 
 * Reusable card component for displaying book information.
 * Used in book listings, search results, and featured sections.
 * 
 * FEATURES:
 * 1. Book cover image with fallback placeholder
 * 2. Category badge with color coding
 * 3. Low stock warning badge
 * 4. Star rating display (static for demo)
 * 5. Add to cart button with loading state
 * 6. Edit button for admin users
 * 7. Success/error message feedback
 * 
 * CATEGORY COLOR CODING:
 * - Science: Red
 * - Art: Orange/Yellow
 * - Religion: Purple
 * - History: Pink/Rose
 * - Geography: Magenta
 * 
 * PROPS:
 * @prop {Book} book - The book data to display
 * @prop {Function} onEdit - Optional callback for edit button (admin only)
 * 
 * ACCESSIBILITY:
 * - Alt text for images
 * - Title tooltips for truncated text
 * - ARIA labels on buttons
 * 
 * @author Bookstore Development Team
 * @version 1.0.0
 * ============================================================================
 */

// React import
import React from 'react';

// Type import for Book
import { Book } from '../types';

// Context hooks for auth and cart
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Icons for buttons and decorations
import { FaShoppingCart, FaEdit, FaStar } from 'react-icons/fa';

// Router hook for navigation
import { useNavigate } from 'react-router-dom';

/**
 * Props interface for BookCard component
 */
interface BookCardProps {
  /** The book object containing all book data */
  book: Book;
  /** Optional callback function when edit button is clicked (admin only) */
  onEdit?: (book: Book) => void;
}

/**
 * BookCard Component
 * 
 * Displays a book in a card format with image, details, and actions.
 * Handles add to cart functionality and displays feedback messages.
 */
const BookCard: React.FC<BookCardProps> = ({ book, onEdit }) => {
  // ========================================
  // HOOKS AND CONTEXT
  // ========================================
  
  // Auth context for user info and authentication status
  const { user, isAuthenticated } = useAuth();
  
  // Cart context for add to cart function
  const { addToCart } = useCart();
  
  // Navigation hook for redirecting to login
  const navigate = useNavigate();

  // ========================================
  // LOCAL STATE
  // ========================================
  
  // Loading state for add to cart button
  const [addingToCart, setAddingToCart] = React.useState(false);
  
  // Feedback message state (success or error)
  const [cartMessage, setCartMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ========================================
  // EVENT HANDLERS
  // ========================================

  /**
   * Handles adding the book to cart
   * Redirects to login if not authenticated
   * Shows success/error message after operation
   */
  const handleAddToCart = async () => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setAddingToCart(true);
    setCartMessage(null);
    
    try {
      await addToCart(book.isbn);
      // Show success message for 2 seconds
      setCartMessage({ type: 'success', text: 'Added to cart!' });
      setTimeout(() => setCartMessage(null), 2000);
    } catch (error) {
      // Show error message for 3 seconds
      setCartMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to add to cart' });
      setTimeout(() => setCartMessage(null), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  /**
   * Returns style object for category badge based on category name
   * @param category - Book category
   * @returns Object with background and text color
   */
  const getCategoryStyle = (category: string) => {
    const styles: { [key: string]: { bg: string; color: string } } = {
      'Science': { bg: 'rgba(239, 68, 68, 0.15)', color: '#dc2626' },
      'Art': { bg: 'rgba(245, 158, 11, 0.15)', color: '#d97706' },
      'Religion': { bg: 'rgba(139, 92, 246, 0.15)', color: '#7c3aed' },
      'History': { bg: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' },
      'Geography': { bg: 'rgba(217, 70, 239, 0.15)', color: '#d946ef' }
    };
    return styles[category] || { bg: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' };
  };

  // Get style for current book's category
  const categoryStyle = getCategoryStyle(book.category);

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="card h-100 border-0" style={{ borderRadius: '16px' }}>
      {/* ========== IMAGE SECTION ========== */}
      <div className="position-relative overflow-hidden" style={{ borderRadius: '16px 16px 0 0' }}>
        {/* Book cover image with fallback */}
        <img
          src={book.imageUrl || `https://via.placeholder.com/300x400?text=${encodeURIComponent(book.title.substring(0, 15))}`}
          className="card-img-top"
          alt={book.title}
          style={{ height: '280px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          onError={(e) => {
            // Fallback image on error
            e.currentTarget.src = `https://via.placeholder.com/300x400/f43f5e/ffffff?text=${encodeURIComponent(book.title.substring(0, 10))}`;
          }}
        />
        {/* Category badge - top right */}
        <span
          className="position-absolute top-0 end-0 m-3 px-3 py-1 rounded-pill fw-medium small"
          style={{ backgroundColor: categoryStyle.bg, color: categoryStyle.color }}
        >
          {book.category}
        </span>
        {/* Low stock warning badge - top left (only if stock is low but not zero) */}
        {book.quantity <= book.threshold && book.quantity > 0 && (
          <span className="position-absolute top-0 start-0 m-3 badge bg-warning text-dark rounded-pill">
            Low Stock
          </span>
        )}
      </div>
      
      {/* ========== CARD BODY ========== */}
      <div className="card-body d-flex flex-column p-4">
        {/* Star rating (static display) */}
        <div className="d-flex align-items-center mb-2">
          <div className="d-flex text-warning me-2">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={12} className={i < 4 ? '' : 'opacity-25'} />
            ))}
          </div>
          <small className="text-muted">(4.0)</small>
        </div>
        
        {/* Book title - truncated to 2 lines */}
        <h6 className="card-title fw-bold mb-1" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '48px'
        }} title={book.title}>
          {book.title}
        </h6>
        
        {/* Author names - truncated with ellipsis */}
        <p className="card-text text-muted small mb-1" style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          by {book.authors.join(', ')}
        </p>
        <p className="card-text small text-muted mb-3">
          {book.publisher} • {book.publicationYear}
        </p>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="h4 mb-0 fw-bold" style={{ color: 'var(--primary-color)' }}>${book.sellingPrice.toFixed(2)}</span>
            <span
              className={`badge rounded-pill px-3 py-2 ${book.quantity > 0 ? '' : ''}`}
              style={{
                backgroundColor: book.quantity > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: book.quantity > 0 ? '#059669' : '#dc2626'
              }}
            >
              {book.quantity > 0 ? `${book.quantity} in stock` : 'Out of stock'}
            </span>
          </div>
          {cartMessage && (
            <div className={`alert alert-${cartMessage.type === 'success' ? 'success' : 'danger'} py-2 px-3 mb-2 small rounded-3`}>
              {cartMessage.text}
            </div>
          )}
          <div className="d-grid gap-2">
            {(!user || user?.role === 'customer') && (
              <button
                className="btn btn-primary py-2 rounded-3"
                onClick={handleAddToCart}
                disabled={book.quantity === 0 || addingToCart}
                style={{ fontWeight: 500 }}
              >
                {addingToCart ? (
                  <span className="spinner-border spinner-border-sm me-2" />
                ) : (
                  <FaShoppingCart className="me-2" />
                )}
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            )}
            {user?.role === 'admin' && onEdit && (
              <button
                className="btn btn-outline-secondary py-2 rounded-3"
                onClick={() => onEdit(book)}
                style={{ fontWeight: 500 }}
              >
                <FaEdit className="me-2" />
                Edit Book
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
