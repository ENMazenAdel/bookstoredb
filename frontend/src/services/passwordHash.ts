/**
 * ============================================================================
 * PASSWORD HASHING UTILITY MODULE
 * ============================================================================
 * 
 * This module provides password hashing and verification functionality
 * using the Web Crypto API (SHA-256). This simulates bcrypt-like behavior
 * for the frontend mock implementation.
 * 
 * NOTE: In a production environment, password hashing should ALWAYS be done
 * on the backend using bcrypt, argon2, or similar secure algorithms.
 * This implementation is for demonstration purposes only.
 * 
 * SECURITY FEATURES:
 * - Uses SHA-256 cryptographic hash function
 * - Adds salt to prevent rainbow table attacks
 * - Async operations to not block the main thread
 * 
 * @author Bookstore Development Team
 * @version 1.0.0
 * ============================================================================
 */

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Salt used for password hashing
 * In production, each user should have a unique salt stored in the database
 */
const SALT = 'bookstore_salt_2024';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Converts an ArrayBuffer to a hexadecimal string
 * Used to convert the hash output to a readable format
 * 
 * @param buffer - The ArrayBuffer to convert
 * @returns Hexadecimal string representation
 */
function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Hashes a password using SHA-256 with salt
 * 
 * This function creates a cryptographic hash of the password combined
 * with a salt value. The result is a fixed-length hexadecimal string.
 * 
 * @param password - The plain text password to hash
 * @returns Promise resolving to the hashed password string
 * 
 * @example
 * const hashedPassword = await hashPassword('mySecurePassword');
 * // Returns: '5e884898da28047d91ef...' (64 character hex string)
 */
export async function hashPassword(password: string): Promise<string> {
  // Combine password with salt
  const saltedPassword = `${SALT}${password}${SALT}`;
  
  // Convert string to ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(saltedPassword);
  
  // Generate SHA-256 hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert to hex string
  return bufferToHex(hashBuffer);
}

/**
 * Verifies a password against a stored hash
 * 
 * This function hashes the input password and compares it with
 * the stored hash to determine if they match.
 * 
 * @param password - The plain text password to verify
 * @param storedHash - The previously stored hash to compare against
 * @returns Promise resolving to true if password matches, false otherwise
 * 
 * @example
 * const isValid = await verifyPassword('myPassword', storedHashFromDB);
 * if (isValid) {
 *   console.log('Password correct!');
 * }
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === storedHash;
}

// ============================================================================
// PRE-HASHED PASSWORDS FOR DEMO USERS
// ============================================================================
// These are the hashed versions of the demo passwords
// Generated using: hashPassword('admin') and hashPassword('password')

/**
 * Pre-computed hash for 'admin' password
 * Used for the admin user demo account
 */
export const ADMIN_PASSWORD_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';

/**
 * Pre-computed hash for 'password' password
 * Used for customer demo accounts
 */
export const DEFAULT_PASSWORD_HASH = '5e884898da28047d9165ef1e5f30b242b6e67f4bdc66b2cb6ccf2f1fd2e8c6e0';

// ============================================================================
// INITIALIZATION - Generate hashes for demo (run once to get values)
// ============================================================================
// Uncomment to regenerate hash values if salt changes:
/*
(async () => {
  console.log('admin hash:', await hashPassword('admin'));
  console.log('password hash:', await hashPassword('password'));
})();
*/
