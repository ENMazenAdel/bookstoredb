/**
 * @fileoverview Customer Pages Barrel Export
 * 
 * Re-exports all customer-facing page components.
 * Some pages are public (Home, BrowseBooks), others require customer authentication.
 * 
 * @module pages/customer
 * 
 * @example
 * import { Home, BrowseBooks, Cart, OrderHistory, Profile, EditProfile } from './customer';
 */

/** Home - Landing page with hero, categories, and featured books (public) */
export { default as Home } from './Home';

/** BrowseBooks - Book catalog with filtering, sorting, and search (public) */
export { default as BrowseBooks } from './BrowseBooks';

/** Cart - Shopping cart with checkout functionality (customer only) */
export { default as Cart } from './Cart';

/** OrderHistory - List of past orders with details view (customer only) */
export { default as OrderHistory } from './OrderHistory';

/** Profile - View user profile information (any authenticated user) */
export { default as Profile } from './Profile';

/** EditProfile - Form to update user profile (customer only) */
export { default as EditProfile } from './EditProfile';
