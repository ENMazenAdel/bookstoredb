import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Cart, CheckoutData, CustomerOrder } from '../types';
import { cartApi } from '../services/api';
import { useAuth } from './AuthContext';

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

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart>({ items: [], totalItems: 0, totalPrice: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
      return;
    }
    setIsLoading(true);
    try {
      const data = await cartApi.get();
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (isbn: string, quantity: number = 1) => {
    setIsLoading(true);
    try {
      const updatedCart = await cartApi.addItem(isbn, quantity);
      setCart(updatedCart);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (isbn: string, quantity: number) => {
    setIsLoading(true);
    try {
      const updatedCart = await cartApi.updateQuantity(isbn, quantity);
      setCart(updatedCart);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(async (isbn: string) => {
    setIsLoading(true);
    try {
      const updatedCart = await cartApi.removeItem(isbn);
      setCart(updatedCart);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const updatedCart = await cartApi.clear();
      setCart(updatedCart);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkout = useCallback(async (checkoutData: CheckoutData): Promise<CustomerOrder> => {
    if (!user) throw new Error('Must be logged in to checkout');
    setIsLoading(true);
    try {
      const order = await cartApi.checkout(checkoutData, user.id);
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
      return order;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

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

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
