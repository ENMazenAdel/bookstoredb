import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { LoadingSpinner } from '../../components';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaCreditCard, FaLock, FaArrowRight } from 'react-icons/fa';

const Cart: React.FC = () => {
  const { cart, isLoading, updateQuantity, removeFromCart, checkout } = useCart();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    creditCardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleQuantityChange = async (isbn: string, newQuantity: number) => {
    try {
      await updateQuantity(isbn, newQuantity);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
    }
  };

  const handleRemove = async (isbn: string) => {
    try {
      await removeFromCart(isbn);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    try {
      const order = await checkout(checkoutData);
      navigate('/orders', { state: { newOrder: order } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading && cart.items.length === 0) {
    return <LoadingSpinner message="Loading cart..." />;
  }

  if (cart.items.length === 0) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <div className="container py-5">
          <div className="text-center py-5">
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem'
            }}>
              <FaShoppingCart size={48} style={{ color: '#f43f5e' }} />
            </div>
            <h2 className="fw-bold mb-3" style={{ color: '#1e293b' }}>Your Cart is Empty</h2>
            <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto 2rem' }}>
              Looks like you haven't added any books yet. Start exploring our collection!
            </p>
            <button
              className="btn btn-lg px-5 py-3 text-white fw-semibold"
              onClick={() => navigate('/books')}
              style={{
                background: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)',
                borderRadius: '12px',
                border: 'none'
              }}
            >
              Browse Books
              <FaArrowRight className="ms-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div className="container py-5">
        <h2 className="mb-4 fw-bold d-flex align-items-center" style={{ color: '#1e293b' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '1rem'
          }}>
            <FaShoppingCart className="text-white" />
          </div>
          Shopping Cart
        </h2>

        {error && (
          <div className="alert alert-danger border-0 rounded-3 alert-dismissible fade show" role="alert" style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#dc2626'
          }}>
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        <div className="row">
          {/* Cart Items */}
          <div className="col-lg-8 mb-4">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '20px' }}>
              <div className="card-body p-4">
                {cart.items.map((item, index) => (
                  <div
                    key={item.book.isbn}
                    className={`row align-items-center py-4 ${index !== cart.items.length - 1 ? 'border-bottom' : ''}`}
                  >
                    <div className="col-auto">
                      <img
                        src={item.book.imageUrl || `https://via.placeholder.com/100x130/6366f1/ffffff?text=Book`}
                        alt={item.book.title}
                        style={{ width: '100px', height: '130px', objectFit: 'cover', borderRadius: '12px' }}
                      />
                    </div>
                    <div className="col">
                      <h6 className="mb-1 fw-bold" style={{ color: '#1e293b' }}>{item.book.title}</h6>
                      <p className="small mb-2" style={{ color: '#64748b' }}>{item.book.authors.join(', ')}</p>
                      <p className="fw-bold mb-0" style={{ color: '#f43f5e', fontSize: '1.1rem' }}>
                        ${item.book.sellingPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="col-auto">
                      <div className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ backgroundColor: '#f1f5f9' }}>
                        <button
                          className="btn btn-sm border-0"
                          onClick={() => handleQuantityChange(item.book.isbn, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          style={{ color: '#64748b' }}
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="px-3 fw-semibold" style={{ color: '#1e293b' }}>{item.quantity}</span>
                        <button
                          className="btn btn-sm border-0"
                          onClick={() => handleQuantityChange(item.book.isbn, item.quantity + 1)}
                          disabled={item.quantity >= item.book.quantity}
                          style={{ color: '#64748b' }}
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="col-auto text-end">
                      <p className="fw-bold mb-2" style={{ color: '#1e293b', fontSize: '1.2rem' }}>
                        ${(item.book.sellingPrice * item.quantity).toFixed(2)}
                      </p>
                      <button
                        className="btn btn-sm rounded-3"
                        onClick={() => handleRemove(item.book.isbn)}
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          border: 'none'
                        }}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div className="card-header border-0 py-4" style={{
                background: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)'
              }}>
                <h5 className="mb-0 text-white fw-bold">Order Summary</h5>
              </div>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between mb-3">
                  <span style={{ color: '#64748b' }}>Items ({cart.totalItems})</span>
                  <span className="fw-semibold" style={{ color: '#1e293b' }}>${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span style={{ color: '#64748b' }}>Shipping</span>
                  <span className="fw-semibold" style={{ color: '#f59e0b' }}>Free</span>
                </div>
                <hr style={{ borderColor: '#e2e8f0' }} />
                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold" style={{ color: '#1e293b' }}>Total</span>
                  <span className="fw-bold h4 mb-0" style={{ color: '#f43f5e' }}>
                    ${cart.totalPrice.toFixed(2)}
                  </span>
                </div>

                {!showCheckout ? (
                  <button
                    className="btn w-100 py-3 text-white fw-semibold"
                    onClick={() => setShowCheckout(true)}
                    style={{
                      background: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)',
                      borderRadius: '12px',
                      border: 'none'
                    }}
                  >
                    <FaCreditCard className="me-2" />
                    Proceed to Checkout
                  </button>
                ) : (
                  <form onSubmit={handleCheckout}>
                    <div className="mb-3">
                      <label className="form-label fw-medium" style={{ color: '#475569' }}>Credit Card Number</label>
                      <input
                        type="text"
                        className="form-control border-0 py-3"
                        placeholder="1234 5678 9012 3456"
                        value={checkoutData.creditCardNumber}
                        onChange={(e) => setCheckoutData(prev => ({
                          ...prev,
                          creditCardNumber: e.target.value
                        }))}
                        style={{ backgroundColor: '#f1f5f9', borderRadius: '10px' }}
                        required
                      />
                    </div>
                    <div className="row mb-4">
                      <div className="col">
                        <label className="form-label fw-medium" style={{ color: '#475569' }}>Expiry Date</label>
                        <input
                          type="text"
                          className="form-control border-0 py-3"
                          placeholder="MM/YY"
                          value={checkoutData.expiryDate}
                          onChange={(e) => setCheckoutData(prev => ({
                            ...prev,
                            expiryDate: e.target.value
                          }))}
                          style={{ backgroundColor: '#f1f5f9', borderRadius: '10px' }}
                          required
                        />
                      </div>
                      <div className="col">
                        <label className="form-label fw-medium" style={{ color: '#475569' }}>CVV</label>
                        <input
                          type="text"
                          className="form-control border-0 py-3"
                          placeholder="123"
                          value={checkoutData.cvv}
                          onChange={(e) => setCheckoutData(prev => ({
                            ...prev,
                            cvv: e.target.value
                          }))}
                          style={{ backgroundColor: '#f1f5f9', borderRadius: '10px' }}
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn w-100 py-3 text-white fw-semibold mb-2"
                      disabled={processing}
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                        borderRadius: '12px',
                        border: 'none'
                      }}
                    >
                      {processing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaLock className="me-2" />
                          Complete Purchase
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn w-100 py-3 fw-semibold"
                      onClick={() => setShowCheckout(false)}
                      style={{
                        backgroundColor: '#f1f5f9',
                        color: '#64748b',
                        borderRadius: '12px',
                        border: 'none'
                      }}
                    >
                      Cancel
                    </button>
                  </form>
                )}

                <div className="text-center mt-4">
                  <small style={{ color: '#94a3b8' }}>
                    <FaLock className="me-1" size={12} />
                    Secure checkout powered by SSL
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
