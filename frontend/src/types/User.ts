/**
 * @fileoverview User Type Definitions
 * 
 * This module defines TypeScript interfaces and types for user-related
 * data structures including authentication, registration, and user profiles.
 * 
 * @module types/User
 */

/**
 * User role enumeration for role-based access control (RBAC).
 * 
 * Roles determine:
 * - Navigation menu items displayed
 * - Pages/routes accessible
 * - API operations permitted
 * 
 * @example
 * const role: UserRole = 'admin';
 */
export type UserRole = 'admin' | 'customer';

/**
 * Represents a user account in the system.
 * 
 * This interface defines the user profile data stored in the database
 * and used throughout the application for identity and authorization.
 * 
 * @interface User
 * 
 * @example
 * const user: User = {
 *   id: 'user-001',
 *   username: 'johndoe',
 *   email: 'john@example.com',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   phone: '555-1234',
 *   shippingAddress: '123 Main St, City, State 12345',
 *   role: 'customer'
 * };
 */
export interface User {
  /** Unique user identifier (UUID format) */
  id: string;
  
  /** Display username (used for login) */
  username: string;
  
  /** User's email address */
  email: string;
  
  /** User's first name */
  firstName: string;
  
  /** User's last name */
  lastName: string;
  
  /** Contact phone number */
  phone: string;
  
  /** Default shipping address for orders */
  shippingAddress: string;
  
  /** User role for access control */
  role: UserRole;
}

/**
 * Credentials required for user authentication.
 * 
 * Used by the Login component to submit authentication requests.
 * 
 * @interface LoginCredentials
 * 
 * @example
 * const credentials: LoginCredentials = {
 *   username: 'johndoe',
 *   password: 'securePassword123'
 * };
 */
export interface LoginCredentials {
  /** User's username */
  username: string;
  
  /** User's password (sent securely, not stored in plain text) */
  password: string;
}

/**
 * Data required for new user registration.
 * 
 * Used by the Register component to create new user accounts.
 * All customers are registered with 'customer' role by default.
 * 
 * @interface RegisterData
 * 
 * @example
 * const registration: RegisterData = {
 *   username: 'newuser',
 *   password: 'SecurePass123!',
 *   email: 'newuser@example.com',
 *   firstName: 'Jane',
 *   lastName: 'Doe',
 *   phone: '555-5678',
 *   shippingAddress: '456 Oak Ave, City, State 67890'
 * };
 */
export interface RegisterData {
  /** Desired username (must be unique, used for login) */
  username: string;
  
  /** Password (min 6 characters required) */
  password: string;
  
  /** Email address (must be unique) */
  email: string;
  
  /** User's first name */
  firstName: string;
  
  /** User's last name */
  lastName: string;
  
  /** Contact phone number */
  phone: string;
  
  /** Shipping address for deliveries */
  shippingAddress: string;
}

/**
 * Authentication state managed by AuthContext.
 * 
 * Tracks the current authentication status and user information
 * throughout the application lifecycle.
 * 
 * @interface AuthState
 * 
 * @example
 * // Authenticated state
 * const authState: AuthState = {
 *   user: { id: '1', username: 'johndoe', ... },
 *   isAuthenticated: true,
 *   isLoading: false
 * };
 * 
 * // Loading state (checking session)
 * const loadingState: AuthState = {
 *   user: null,
 *   isAuthenticated: false,
 *   isLoading: true
 * };
 */
export interface AuthState {
  /** Current authenticated user (null if not logged in) */
  user: User | null;
  
  /** Whether a user is currently authenticated */
  isAuthenticated: boolean;
  
  /** Whether authentication status is being checked/loaded */
  isLoading: boolean;
}
