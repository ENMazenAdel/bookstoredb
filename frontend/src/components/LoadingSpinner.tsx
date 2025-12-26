/**
 * ============================================================================
 * LOADING SPINNER COMPONENT
 * ============================================================================
 * 
 * Reusable loading indicator component.
 * Displays a spinning animation with optional message.
 * 
 * USAGE:
 * - While fetching data from API
 * - During form submissions
 * - When processing user actions
 * - Page transitions
 * 
 * PROPS:
 * @prop {string} size - Size of spinner: 'sm', 'md', or 'lg' (default: 'md')
 * @prop {string} message - Optional message to display below spinner
 * 
 * STYLING:
 * - Uses Bootstrap spinner classes
 * - Primary color theme
 * - Centered flex layout
 * 
 * ACCESSIBILITY:
 * - Hidden "Loading..." text for screen readers
 * - role="status" for ARIA
 * 
 * EXAMPLE:
 * ```tsx
 * <LoadingSpinner message="Loading books..." />
 * <LoadingSpinner size="sm" />
 * ```
 * 
 * @author Bookstore Development Team
 * @version 1.0.0
 * ============================================================================
 */

// React import
import React from 'react';

/**
 * Props interface for LoadingSpinner component
 */
interface LoadingSpinnerProps {
  /** Size of the spinner: 'sm' | 'md' | 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** Optional message to display below the spinner */
  message?: string;
}

/**
 * LoadingSpinner Component
 * 
 * Renders a Bootstrap spinner with optional size and message.
 * Centers itself within the parent container.
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', message }) => {
  // Map size prop to Bootstrap class names
  const sizeClasses = {
    sm: '',                    // Default small
    md: 'spinner-border-md',   // Medium size
    lg: 'spinner-border-lg'    // Large size
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5">
      {/* Bootstrap spinner with configurable size */}
      <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
        {/* Visually hidden text for screen readers */}
        <span className="visually-hidden">Loading...</span>
      </div>
      {/* Optional message below spinner */}
      {message && <p className="mt-3 text-muted">{message}</p>}
    </div>
  );
};

// Export as default for easy importing
export default LoadingSpinner;
