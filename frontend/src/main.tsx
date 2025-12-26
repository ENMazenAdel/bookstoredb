/**
 * @fileoverview Application Entry Point
 * 
 * This is the entry point for the Bookstore React application.
 * It mounts the root App component to the DOM using React 18's
 * createRoot API wrapped in StrictMode for development checks.
 * 
 * @module main
 * 
 * @description
 * StrictMode enables:
 * - Detection of unsafe lifecycles
 * - Warning about legacy string ref API usage
 * - Warning about deprecated findDOMNode usage
 * - Detection of unexpected side effects
 * - Detection of legacy context API
 * 
 * The application is mounted to the 'root' div element
 * defined in index.html.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

/**
 * Mount the React application to the DOM.
 * 
 * Uses the non-null assertion (!) because we're certain
 * the 'root' element exists in index.html.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
