import React from 'react';
import { Book } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaEdit, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [addingToCart, setAddingToCart] = React.useState(false);
  const [cartMessage, setCartMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    setCartMessage(null);
    try {
      await addToCart(book.isbn);
      setCartMessage({ type: 'success', text: 'Added to cart!' });
      setTimeout(() => setCartMessage(null), 2000);
    } catch (error) {
      setCartMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to add to cart' });
      setTimeout(() => setCartMessage(null), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

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

  const categoryStyle = getCategoryStyle(book.category);

  return (
    <div className="card h-100 border-0" style={{ borderRadius: '16px' }}>
      <div className="position-relative overflow-hidden" style={{ borderRadius: '16px 16px 0 0' }}>
        <img
          src={book.imageUrl || `https://via.placeholder.com/300x400?text=${encodeURIComponent(book.title.substring(0, 15))}`}
          className="card-img-top"
          alt={book.title}
          style={{ height: '280px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/300x400/f43f5e/ffffff?text=${encodeURIComponent(book.title.substring(0, 10))}`;
          }}
        />
        <span
          className="position-absolute top-0 end-0 m-3 px-3 py-1 rounded-pill fw-medium small"
          style={{ backgroundColor: categoryStyle.bg, color: categoryStyle.color }}
        >
          {book.category}
        </span>
        {book.quantity <= book.threshold && book.quantity > 0 && (
          <span className="position-absolute top-0 start-0 m-3 badge bg-warning text-dark rounded-pill">
            Low Stock
          </span>
        )}
      </div>
      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex align-items-center mb-2">
          <div className="d-flex text-warning me-2">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={12} className={i < 4 ? '' : 'opacity-25'} />
            ))}
          </div>
          <small className="text-muted">(4.0)</small>
        </div>
        <h6 className="card-title fw-bold mb-1" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '48px'
        }} title={book.title}>
          {book.title}
        </h6>
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
