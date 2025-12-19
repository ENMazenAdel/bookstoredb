import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaBook, FaTwitter, FaFacebook, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer: React.FC = () => {
  const categoryColors: { [key: string]: string } = {
    'Science': '#0ea5e9',
    'Art': '#f59e0b',
    'History': '#ef4444',
    'Religion': '#8b5cf6',
    'Geography': '#d946ef'
  };

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
      paddingTop: '4rem',
      paddingBottom: '2rem',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center mb-3">
              <div style={{
                background: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <FaBook className="text-white" size={22} />
              </div>
              <span className="fw-bold ms-2 text-white" style={{ fontSize: '1.5rem' }}>BookStore</span>
            </div>
            <p style={{ color: '#94a3b8', lineHeight: '1.7' }}>
              Your one-stop destination for all your reading needs. Discover thousands of books across various genres and categories.
            </p>
            <div className="d-flex gap-3 mt-4">
              {[
                { icon: FaTwitter, color: '#1da1f2' },
                { icon: FaFacebook, color: '#4267b2' },
                { icon: FaInstagram, color: '#e1306c' },
                { icon: FaGithub, color: '#ffffff' }
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: social.color,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-4">Categories</h6>
            <ul className="list-unstyled">
              {Object.entries(categoryColors).map(([category, color]) => (
                <li key={category} className="mb-2">
                  <Link
                    to={`/books?category=${category}`}
                    className="text-decoration-none d-flex align-items-center"
                    style={{ color: '#94a3b8', transition: 'color 0.2s ease' }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        marginRight: '10px'
                      }}
                    />
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-4">Quick Links</h6>
            <ul className="list-unstyled">
              {[
                { label: 'Browse Books', path: '/books' },
                { label: 'Login', path: '/login' },
                { label: 'Register', path: '/register' },
                { label: 'About Us', path: '#' },
                { label: 'FAQs', path: '#' }
              ].map((link, i) => (
                <li key={i} className="mb-2">
                  <Link
                    to={link.path}
                    className="text-decoration-none"
                    style={{ color: '#94a3b8' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-4">Contact Us</h6>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-start">
                <FaEnvelope style={{ color: '#f43f5e', marginTop: '4px', marginRight: '12px' }} />
                <span style={{ color: '#94a3b8' }}>support@bookstore.com</span>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <FaPhone style={{ color: '#f43f5e', marginTop: '4px', marginRight: '12px' }} />
                <span style={{ color: '#94a3b8' }}>(555) 123-4567</span>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <FaMapMarkerAlt style={{ color: '#f43f5e', marginTop: '4px', marginRight: '12px' }} />
                <span style={{ color: '#94a3b8' }}>123 Book Street,<br />Reading City, RC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', marginTop: '3rem', marginBottom: '2rem' }} />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <small style={{ color: '#64748b' }}>
              © 2025 BookStore. All rights reserved. Made with ❤️ for book lovers.
            </small>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <small style={{ color: '#64748b' }}>
              <a href="#" className="text-decoration-none me-3" style={{ color: '#94a3b8' }}>Privacy Policy</a>
              <a href="#" className="text-decoration-none me-3" style={{ color: '#94a3b8' }}>Terms of Service</a>
              <a href="#" className="text-decoration-none" style={{ color: '#94a3b8' }}>Cookie Policy</a>
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
