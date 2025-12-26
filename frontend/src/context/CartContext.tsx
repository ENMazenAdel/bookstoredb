/**
 * ============================================================================
 * SHOPPING CART CONTEXT MODULE
 * ============================================================================
 * 
 * This module provides global shopping cart state management using React Context.
 * It handles all cart operations including adding items, updating quantities,
 * removing items, and processing checkout.
 * 
 * FEATURES:
 * - Add/remove items from cart
 * - Update item quantities
 * - Checkout with payment validation
 * - Automatic cart refresh on auth state change
 * - Cart isolation per user
 * 
 * DEPENDENCIES:
 * - Requires AuthContext (uses useAuth hook)
 * - Uses cartApi for backend operations
 * 
 * USAGE:
 * 1. Wrap app with <CartProvider> inside <AuthProvider>
 * 2. Use useCart() hook in components to access cart state and methods
 * 
 * @example
 * // In a component:
 * const { cart, addToCart, checkout } = useCart();
 * console.log(`Cart has ${cart.totalItems} items`);
 * 
 * @author Bookstore Development Team
 * @version 1.0.0
 * ============================================================================
 */

// React imports for context and state management
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// Type imports for TypeScript type safety
import { Cart, CheckoutData, CustomerOrder } from '../types';

// API service for cart operations
import { cartApi } from '../services/api';

// Auth context hook - cart depends on authentication state
import { useAuth } from './AuthContext';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * CartContextType defines all values and functions available through useCart()
 * 
 * Properties:
 * - cart: Current cart state with items, totalItems, and totalPrice
 * - isLoading: Boolean indicating if a cart operation is in progress
 * 
 * Methods:
 * - addToCart: Add a book to the cart
 * - updateQuantity: Change quantity of an item in cart
 * - removeFromCart: Remove an item from cart
 * - clearCart: Remove all items from cart
 * - checkout: Process checkout with payment information
 * - refreshCart: Force refresh cart from server
 */
interface CartContextType {
  cart: Cart;
  isLoading: boolean;
  addToCart: (isbn: string, quantity?: number) => Promise<void>;
  updateQuantity: (isbn: string, quantity: number) => Promise<void>;
  removeFromCart: (isbn: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: (checkoutData: CheckoutData) => Promise<CustomerOrder>;
  refreshCart: () => Promise<void>;
}

// Create the context with undefined default (will be provided by CartProvider)
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Props interface for CartProvider component
 */
interface CartProviderProps {
  children: ReactNode;  // Child components that will have access to cart context
}

// ============================================================================
// CART PROVIDER COMPONENT
// ============================================================================

/**
 * CartProvider Component
 * 
 * Provides shopping cart context to all child components.
 * Manages cart state and provides methods for cart operations.
 * 
 * IMPORTANT: This component must be nested inside AuthProvider
 * because it depends on authentication state.
 * 
 * @param children - Child components to wrap with cart context
 * 
 * @example
 * // In App.tsx:
 * <AuthProvider>
 *   <CartProvider>
 *     <App />
 *   </CartProvider>
 * </AuthProvider>
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // ========================================
  // DEPENDENCIES
  // ========================================
  
  // Get authentication state from AuthContext
  // Cart operations require knowing which user is logged in
  const { user, isAuthenticated } = useAuth();
  
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  /**
   * Cart state containing:
   * - items: Array of cart items (book + quantity)
   * - totalItems: Sum of all item quantities
   * - totalPrice: Sum of all item prices
   */
  const [cart, setCart] = useState<Cart>({ items: [], totalItems: 0, totalPrice: 0 });
  
  /**
   * Loading state for UI feedback during async operations
   */
  const [isLoading, setIsLoading] = useState(false);

  // ========================================
  // CART REFRESH FUNCTION
  // ========================================

  /**
   * Refresh Cart Method
   * 
   * Fetches the current cart state from the API.
   * Resets cart to empty if user is not authenticated.
   * 
   * Called automatically when auth state changes.
   * Can be called manually if cart needs to be synced.
   */
  const refreshCart = useCallback(async () => {
    // If not logged in, ensure cart is empty
    if (!isAuthenticated) {
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
      return;
    }
    
    setIsLoading(true);
    try {
      // Fetch current cart from API
      const data = await cartApi.get();
      setCart(data);
    } catch (error) {
      // Log error but don't crash the app
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]); // Depends on auth state

  // ========================================
  // AUTO-REFRESH ON AUTH CHANGE
  // ========================================

  /**
   * Effect: Refresh cart when authentication state changes
   * 
   * This ensures:
   * - Cart is loaded when user logs in
   * - Cart is cleared when user logs out
   * - Correct user's cart is shown after login
   */
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // ========================================
  // CART OPERATION METHODS
  // ========================================

  /**
   * Add to Cart Method
   * 
   * Adds a book to the shopping cart.
   * If book is already in cart, increases quantity.
   * Validates stock availability.
   * 
   * @param isbn - ISBN of the book to add
   * @param quantity - Number of copies to add (default: 1)
   * @throws Error if book not found or insufficient stock
   * 
   * @example
   * await addToCart('978-0-06-083865-2', 2);
   */
  const addToCart = useCallback(async (isbn: string, quantity: number = 1) => {
    setIsLoading(true);
    try {
      // Call API to add item
      const updatedCart = await cartApi.addItem(isbn, quantity);
      // Update local state with new cart
      setCart(updatedCart);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update Quantity Method
   * 
   * Changes the quantity of an item already in the cart.
   * If quantity is 0 or less, removes the item.
   * 
   * @param isbn - ISBN of the book to update
   * @param quantity - New quantity for the item
   * @throws Error if item not in cart or insufficient stock
   * 
   * @example
   * await updateQuantity('978-0-06-083865-2', 5);
   */
  const updateQuantity = useCallback(async (isbn: string, quantity: number) => {
    setIsLoading(true);
    try {
      // Call API to update quantity
      const updatedCart = await cartApi.updateQuantity(isbn, quantity);
      setCart(updatedCart);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Remove from Cart Method
   * 
   * Removes an item completely from the cart.
   * 
   * @param isbn - ISBN of the book to remove
   * 
   * @example
   * await removeFromCart('978-0-06-083865-2');
   */
  const removeFromCart = useCallback(async (isbn: string) => {
    setIsLoading(true);
    try {
      // Call API to remove item
      const updatedCart = await cartApi.removeItem(isbn);
      setCart(updatedCart);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear Cart Method
   * 
   * Removes all items from the cart.
   * 
   * @example
   * await clearCart();
   */
  const clearCart = useCallback(async () => {
    setIsLoading(true);
    try {
      // Call API to clear cart
      const updatedCart = await cartApi.clear();
      setCart(updatedCart);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Checkout Method
   * 
   * Processes the checkout with payment information.
   * Creates a customer order and clears the cart.
   * 
   * CHECKOUT PROCESS:
   * 1. Validates user is logged in
   * 2. Validates payment information
   * 3. Validates stock availability
   * 4. Creates customer order
   * 5. Deducts stock from inventory
   * 6. Clears the cart
   * 
   * @param checkoutData - Payment information (credit card, expiry, CVV)
   * @returns Promise resolving to the created CustomerOrder
   * @throws Error if not logged in, invalid payment, or insufficient stock
   * 
   * @example
   * const order = await checkout({
   *   creditCardNumber: '4111111111111111',
   *   expiryDate: '12/25',
   *   cvv: '123'
   * });
   * console.log('Order placed:', order.id);
   */
  const checkout = useCallback(async (checkoutData: CheckoutData): Promise<CustomerOrder> => {
    // Ensure user is logged in
    if (!user) throw new Error('Must be logged in to checkout');
    
    setIsLoading(true);
    try {
      // Call API to process checkout
      const order = await cartApi.checkout(checkoutData, user.id);
      
      // Clear local cart state after successful checkout
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
      
      return order;
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Depends on current user

  // ========================================
  // RENDER
  // ========================================
  
  // Provide context value to all children
  return (
    <CartContext.Provider value={{ 
      cart, 
      isLoading, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart, 
      checkout,
      refreshCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

// ============================================================================
// CUSTOM HOOK
// ============================================================================

/**
 * useCart Hook
 * 
 * Custom hook to access shopping cart context.
 * Must be used within a component wrapped by CartProvider.
 * 
 * @returns CartContextType object with cart state and methods
 * @throws Error if used outside of CartProvider
 * 
 * @example
 * function ProductCard({ book }) {
 *   const { addToCart, isLoading } = useCart();
 *   
 *   const handleAddToCart = async () => {
 *     try {
 *       await addToCart(book.isbn);
 *       alert('Added to cart!');
 *     } catch (error) {
 *       alert(error.message);
 *     }
 *   };
 *   
 *   return (
 *     <button onClick={handleAddToCart} disabled={isLoading}>
 *       Add to Cart
 *     </button>
 *   );
 * }
 */
export const useCart = (): CartContextType => {
  // Get context value
  const context = useContext(CartContext);
  
  // Throw helpful error if hook is used outside provider
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};
