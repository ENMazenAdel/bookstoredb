/**
 * @fileoverview Authentication Pages Barrel Export
 * 
 * Re-exports authentication-related page components.
 * These pages are public and handle user login and registration.
 * 
 * @module pages/auth
 * 
 * @example
 * import { Login, Register } from './auth';
 */

/** Login - User authentication with role-based redirect */
export { default as Login } from './Login';

/** Register - New customer account creation */
export { default as Register } from './Register';
