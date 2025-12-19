import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBook, FaUser, FaLock, FaArrowRight } from 'react-icons/fa';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login({ username, password });
      // Redirect admin users to dashboard, customers to their intended page
      if (user?.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #fdf4ff 100%)'
    }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
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
                  <h2 className="fw-bold mb-2" style={{ color: '#1e293b' }}>Welcome Back</h2>
                  <p style={{ color: '#64748b' }}>Sign in to continue your reading journey</p>
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
                  <div className="mb-4">
                    <label htmlFor="username" className="form-label fw-medium" style={{ color: '#475569' }}>
                      Username
                    </label>
                    <div className="input-group">
                      <span className="input-group-text border-0" style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px 0 0 12px',
                        color: '#94a3b8'
                      }}>
                        <FaUser />
                      </span>
                      <input
                        type="text"
                        className="form-control border-0 py-3"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        required
                        style={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '0 12px 12px 0'
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-medium" style={{ color: '#475569' }}>
                      Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text border-0" style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px 0 0 12px',
                        color: '#94a3b8'
                      }}>
                        <FaLock />
                      </span>
                      <input
                        type="password"
                        className="form-control border-0 py-3"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        style={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '0 12px 12px 0'
                        }}
                      />
                    </div>
                  </div>

                  <div className="d-grid mt-4">
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
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <FaArrowRight className="ms-2" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <p style={{ color: '#64748b' }} className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="fw-semibold text-decoration-none" style={{ color: '#f43f5e' }}>
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                padding: '1.5rem 2rem',
                borderTop: '1px solid rgba(244, 63, 94, 0.1)'
              }}>
                <p className="mb-2 fw-medium small" style={{ color: '#f43f5e' }}>Demo Credentials</p>
                <div className="d-flex gap-4">
                  <div>
                    <small style={{ color: '#64748b' }}>
                      <strong>Admin:</strong> admin / admin
                    </small>
                  </div>
                  <div>
                    <small style={{ color: '#64748b' }}>
                      <strong>Customer:</strong> john_doe / password
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
