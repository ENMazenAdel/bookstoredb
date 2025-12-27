/**
 * @fileoverview Services Barrel Export
 * 
 * Re-exports all API services and mock data from the services directory.
 * Provides a single import point for service layer functionality.
 * 
 * @module services
 * 
 * @example
 * import { authApi, booksApi, cartApi, mockBooks } from '../services';
 */

/** API service modules: authApi, booksApi, publishersApi, ordersApi, cartApi, customerOrdersApi, reportsApi */
export * from './api';

/** Mock data for development: mockBooks, mockPublishers, mockUsers, mockOrders, etc. */
export * from './mockData';

/** Password hashing utilities: hashPassword, verifyPassword */
export * from './passwordHash';
