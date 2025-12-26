/**
 * ============================================================================
 * AUTHENTICATION CONTEXT MODULE
 * ============================================================================
 * 
 * This module provides global authentication state management using React Context.
 * It handles user authentication, session persistence, and profile updates.
 * 
 * FEATURES:
 * - Login/Register functionality
 * - Session persistence using localStorage
 * - Profile update capability
 * - Authentication state available throughout the app
 * 
 * USAGE:
 * 1. Wrap app with <AuthProvider> in main.tsx or App.tsx
 * 2. Use useAuth() hook in components to access auth state and methods
 * 
 * @example
 * // In a component:
 * const { user, isAuthenticated, login, logout } = useAuth();
 * if (isAuthenticated) {
 *   console.log(`Welcome ${user.firstName}!`);
 * }
 * 
 * @author Bookstore Development Team
 * @version 1.0.0
 * ============================================================================
 */

// React imports for context and state management
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// Type imports for TypeScript type safety
import { User, LoginCredentials, RegisterData, AuthState } from '../types';

// API service for authentication operations
import { authApi } from '../services/api';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * AuthContextType extends AuthState with authentication methods
 * This interface defines all values and functions available through useAuth()
 * 
 * Properties (from AuthState):
 * - user: Current logged-in user or null
 * - isAuthenticated: Boolean indicating if user is logged in
 * - isLoading: Boolean indicating if auth operation is in progress
 * 
 * Methods:
 * - login: Authenticate user with credentials
 * - register: Create new user account
 * - logout: End user session
 * - updateProfile: Update user profile information
 */
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create the context with undefined default (will be provided by AuthProvider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props interface for AuthProvider component
 */
interface AuthProviderProps {
  children: ReactNode;  // Child components that will have access to auth context
}

// ============================================================================
// AUTH PROVIDER COMPONENT
// ============================================================================

/**
 * AuthProvider Component
 * 
 * Provides authentication context to all child components.
 * Manages authentication state and provides methods for auth operations.
 * 
 * IMPORTANT: This component should wrap your entire app or the parts
 * that need access to authentication state.
 * 
 * @param children - Child components to wrap with auth context
 * 
 * @example
 * // In App.tsx or main.tsx:
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  /**
   * Authentication state containing:
   * - user: Current user object or null
   * - isAuthenticated: Whether user is logged in
   * - isLoading: Whether an auth operation is in progress
   */
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true           // Start as loading to check for stored session
  });

  // ========================================
  // SESSION PERSISTENCE (useEffect)
  // ========================================
  
  /**
   * Effect: Check for existing session on component mount
   * 
   * On page load/refresh, this checks if user data is stored in localStorage.
   * If found, it restores the session without requiring re-login.
   * 
   * This provides session persistence across page refreshes.
   */
  useEffect(() => {
    // Attempt to retrieve stored user from localStorage
    const storedUser = localStorage.getItem('bookstore_user');
    
    if (storedUser) {
      try {
        // Parse stored JSON and restore session
        const user = JSON.parse(storedUser);
        setState({ user, isAuthenticated: true, isLoading: false });
      } catch {
        // If JSON is invalid, clear the corrupted data
        localStorage.removeItem('bookstore_user');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      // No stored session, just stop loading
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []); // Empty dependency array - run only once on mount

  // ========================================
  // AUTHENTICATION METHODS
  // ========================================

  /**
   * Login Method
   * 
   * Authenticates user with username and password.
   * On success, stores user in localStorage for session persistence.
   * 
   * @param credentials - Object with username and password
   * @returns Promise resolving to authenticated User object
   * @throws Error if authentication fails
   * 
   * @example
   * try {
   *   const user = await login({ username: 'john_doe', password: 'password' });
   *   console.log('Logged in as:', user.firstName);
   * } catch (error) {
   *   console.error('Login failed:', error.message);
   * }
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    // Set loading state while processing
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Call API to authenticate
      const user = await authApi.login(credentials);
      
      // Store user in localStorage for session persistence
      localStorage.setItem('bookstore_user', JSON.stringify(user));
      
      // Update state with authenticated user
      setState({ user, isAuthenticated: true, isLoading: false });
      
      return user;
    } catch (error) {
      // On failure, stop loading but don't change auth state
      setState(prev => ({ ...prev, isLoading: false }));
      throw error; // Re-throw for caller to handle
    }
  }, []); // No dependencies - function doesn't depend on external values

  /**
   * Register Method
   * 
   * Creates a new user account and automatically logs them in.
   * Validates unique username and email through the API.
   * 
   * @param data - Registration data including username, email, name, etc.
   * @returns Promise resolving to newly created User object
   * @throws Error if registration fails (e.g., duplicate username/email)
   * 
   * @example
   * try {
   *   const user = await register({
   *     username: 'new_user',
   *     email: 'user@example.com',
   *     firstName: 'New',
   *     lastName: 'User',
   *     phone: '123-456-7890',
   *     shippingAddress: '123 Main St'
   *   });
   * } catch (error) {
   *   console.error('Registration failed:', error.message);
   * }
   */
  const register = useCallback(async (data: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Call API to create account
      const user = await authApi.register(data);
      
      // Auto-login: store user in localStorage
      localStorage.setItem('bookstore_user', JSON.stringify(user));
      
      // Update state with new authenticated user
      setState({ user, isAuthenticated: true, isLoading: false });
      
      return user;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  /**
   * Logout Method
   * 
   * Ends the user session and clears stored data.
   * Also notifies the API to clear server-side session if applicable.
   * 
   * @example
   * await logout();
   * // User is now logged out, redirect to login page
   */
  const logout = useCallback(async () => {
    // Call API logout (clears currentUserId in api.ts)
    await authApi.logout();
    
    // Clear stored session from localStorage
    localStorage.removeItem('bookstore_user');
    
    // Reset state to unauthenticated
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  /**
   * Update Profile Method
   * 
   * Updates the current user's profile information.
   * Syncs changes to both the API and localStorage.
   * 
   * @param data - Partial User object with fields to update
   * @throws Error if no user is logged in
   * 
   * @example
   * await updateProfile({
   *   firstName: 'Updated',
   *   phone: '555-0199'
   * });
   */
  const updateProfile = useCallback(async (data: Partial<User>) => {
    // Ensure user is logged in
    if (!state.user) throw new Error('No user logged in');
    
    // Call API to update profile
    const updatedUser = await authApi.updateProfile(state.user.id, data);
    
    // Sync updated user to localStorage
    localStorage.setItem('bookstore_user', JSON.stringify(updatedUser));
    
    // Update state with new user data
    setState(prev => ({ ...prev, user: updatedUser }));
  }, [state.user]); // Depends on current user for the ID

  // ========================================
  // RENDER
  // ========================================
  
  // Provide context value to all children
  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================================
// CUSTOM HOOK
// ============================================================================

/**
 * useAuth Hook
 * 
 * Custom hook to access authentication context.
 * Must be used within a component wrapped by AuthProvider.
 * 
 * @returns AuthContextType object with state and methods
 * @throws Error if used outside of AuthProvider
 * 
 * @example
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *   
 *   if (!isAuthenticated) {
 *     return <button onClick={() => login(credentials)}>Login</button>;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Welcome, {user.firstName}!</p>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * }
 */
export const useAuth = (): AuthContextType => {
  // Get context value
  const context = useContext(AuthContext);
  
  // Throw helpful error if hook is used outside provider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
