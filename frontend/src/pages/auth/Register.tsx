import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBook, FaUser, FaLock, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    shippingAddress: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        shippingAddress: formData.shippingAddress
      });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: '#f8fafc',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 16px'
  };

  const inputGroupStyle = {
    backgroundColor: '#f8fafc',
    border: 'none',
    borderRadius: '12px 0 0 12px',
    color: '#94a3b8'
  };

  return (
    <div className="min-vh-100 d-flex align-items-center py-5" style={{
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #fdf4ff 100%)'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">
            <div className="text-center mb-4">
              <Link to="/" className="text-decoration-none d-inline-flex align-items-center">
                <div style={{
                  background: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)',
                  borderRadius: '16px',
                  padding: '14px 18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  boxShadow: '0 10px 40px rgba(244, 63, 94, 0.3)'
                }}>
                  <FaBook className="text-white" size={28} />
                </div>
                <span className="fw-bold ms-3" style={{
                  fontSize: '1.8rem',
                  background: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>BookStore</span>
              </Link>
            </div>

            <div className="card border-0 shadow-lg" style={{ borderRadius: '24px', overflow: 'hidden' }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2" style={{ color: '#1e293b' }}>Create Account</h2>
                  <p style={{ color: '#64748b' }}>Join our bookstore community today</p>
                </div>

                {error && (
                  <div className="alert alert-danger border-0 rounded-3" role="alert" style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#dc2626'
                  }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="firstName" className="form-label fw-medium" style={{ color: '#475569' }}>First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lastName" className="form-label fw-medium" style={{ color: '#475569' }}>Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="username" className="form-label fw-medium" style={{ color: '#475569' }}>Username</label>
                    <div className="input-group">
                      <span className="input-group-text border-0" style={inputGroupStyle}><FaUser /></span>
                      <input
                        type="text"
                        className="form-control border-0"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        style={{ ...inputStyle, borderRadius: '0 12px 12px 0' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-medium" style={{ color: '#475569' }}>Email</label>
                    <div className="input-group">
                      <span className="input-group-text border-0" style={inputGroupStyle}><FaEnvelope /></span>
                      <input
                        type="email"
                        className="form-control border-0"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ ...inputStyle, borderRadius: '0 12px 12px 0' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password" className="form-label fw-medium" style={{ color: '#475569' }}>Password</label>
                      <div className="input-group">
                        <span className="input-group-text border-0" style={inputGroupStyle}><FaLock /></span>
                        <input
                          type="password"
                          className="form-control border-0"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          style={{ ...inputStyle, borderRadius: '0 12px 12px 0' }}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="confirmPassword" className="form-label fw-medium" style={{ color: '#475569' }}>Confirm Password</label>
                      <div className="input-group">
                        <span className="input-group-text border-0" style={inputGroupStyle}><FaLock /></span>
                        <input
                          type="password"
                          className="form-control border-0"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          style={{ ...inputStyle, borderRadius: '0 12px 12px 0' }}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label fw-medium" style={{ color: '#475569' }}>Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text border-0" style={inputGroupStyle}><FaPhone /></span>
                      <input
                        type="tel"
                        className="form-control border-0"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{ ...inputStyle, borderRadius: '0 12px 12px 0' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="shippingAddress" className="form-label fw-medium" style={{ color: '#475569' }}>Shipping Address</label>
                    <div className="input-group">
                      <span className="input-group-text border-0 align-items-start pt-3" style={inputGroupStyle}><FaMapMarkerAlt /></span>
                      <textarea
                        className="form-control border-0"
                        id="shippingAddress"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleChange}
                        rows={2}
                        style={{ ...inputStyle, borderRadius: '0 12px 12px 0' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-lg py-3 text-white fw-semibold d-flex align-items-center justify-content-center"
                      disabled={isLoading}
                      style={{
                        background: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 30px rgba(244, 63, 94, 0.3)'
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <FaArrowRight className="ms-2" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <p style={{ color: '#64748b' }} className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: '#f43f5e' }}>
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
