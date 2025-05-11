/**
 * Utility functions for handling JWT token operations
 */

/**
 * Sets the JWT token in localStorage and dispatches a tokenChanged event
 * @param {string} token - The JWT token to store
 */
export const setToken = (token) => {
  localStorage.setItem('token', token);
  
  // Dispatch a custom event to notify components that the token has changed
  window.dispatchEvent(new CustomEvent('tokenChanged'));
};

/**
 * Removes the JWT token from localStorage and dispatches a tokenChanged event
 */
export const removeToken = () => {
  localStorage.removeItem('token');
  
  // Dispatch a custom event to notify components that the token has changed
  window.dispatchEvent(new CustomEvent('tokenChanged'));
};

/**
 * Gets the JWT token from localStorage
 * @returns {string|null} The JWT token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Checks if a JWT token exists in localStorage
 * @returns {boolean} True if token exists, false otherwise
 */
export const hasToken = () => {
  return !!localStorage.getItem('token');
};
