/**
 * ============================================================================
 * PROTECTED ROUTE COMPONENT
 * ============================================================================
 * 
 * Higher-order component for protecting routes from unauthorized access.
 * Wraps route content and checks authentication/authorization.
 * 
 * FEATURES:
 * 1. Authentication check - redirects to login if not authenticated
 * 2. Role-based authorization - restricts access based on user role
 * 3. Loading state handling - shows spinner while checking auth
 * 4. Preserves intended destination for redirect after login
 * 
 * AUTHORIZATION LOGIC:
 * 1. If loading, show spinner (prevents flash of redirect)
 * 2. If not authenticated, redirect to /login with original location
 * 3. If authenticated but wrong role, redirect to appropriate dashboard
 * 4. If authorized, render children
 * 
 * PROPS:
 * @prop {ReactNode} children - The protected content to render
 * @prop {UserRole[]} allowedRoles - Optional array of roles that can access
 * 
 * USAGE EXAMPLES:
 * ```tsx
 * // Require any authenticated user
 * <ProtectedRoute>
 *   <ProfilePage />
 * </ProtectedRoute>
 * 
 * // Require admin role only
 * <ProtectedRoute allowedRoles={['admin']}>
 *   <AdminDashboard />
 * </ProtectedRoute>
 * 
 * // Require customer role only
 * <ProtectedRoute allowedRoles={['customer']}>
 *   <CheckoutPage />
 * </ProtectedRoute>
 * ```
 * 
 * @author Bookstore Development Team
 * @version 1.0.0
 * ============================================================================
 */

// React import
import React from 'react';

// React Router components for navigation
import { Navigate, useLocation } from 'react-router-dom';

// Auth context for authentication state
import { useAuth } from '../context/AuthContext';

// Type import for user roles
import { UserRole } from '../types';

/**
 * Props interface for ProtectedRoute component
 */
interface ProtectedRouteProps {
  /** The content to render if authorized */
  children: React.ReactNode;
  /** Optional array of roles allowed to access this route */
  allowedRoles?: UserRole[];
}

/**
 * ProtectedRoute Component
 * 
 * Wraps route content and enforces authentication/authorization.
 * Redirects unauthorized users to appropriate pages.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  // ========================================
  // HOOKS AND CONTEXT
  // ========================================
  
  // Get auth state from context
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Get current location for redirect preservation
  const location = useLocation();

  // ========================================
  // AUTHORIZATION LOGIC
  // ========================================

  // Show loading spinner while auth state is being determined
  // This prevents a flash of the login page on refresh
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  // Preserve the intended destination in location state
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check user's role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // User is authenticated but doesn't have required role
    // Redirect to their appropriate dashboard based on role
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Default redirect for customers or unknown roles
    return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized - render the protected content
  return <>{children}</>;
};

// Export as default for easy importing
export default ProtectedRoute;
