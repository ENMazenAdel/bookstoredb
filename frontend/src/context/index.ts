/**
 * @fileoverview Context Barrel Export
 * 
 * Re-exports React context providers and hooks for global state management.
 * These contexts provide authentication and cart functionality app-wide.
 * 
 * @module context
 * 
 * @example
 * // In App.tsx (wrapping with providers)
 * import { AuthProvider, CartProvider } from './context';
 * 
 * // In components (using hooks)
 * import { useAuth, useCart } from '../context';
 */

/** 
 * AuthProvider - Context provider for authentication state
 * useAuth - Hook to access auth state and methods (login, logout, register)
 */
export { AuthProvider, useAuth } from './AuthContext';

/**
 * CartProvider - Context provider for shopping cart state
 * useCart - Hook to access cart state and methods (addToCart, removeFromCart, checkout)
 */
export { CartProvider, useCart } from './CartContext';
