/**
 * Security-related utility functions.
 * 
 * OWASP: Input sanitization helpers to prevent injection attacks.
 */

/**
 * Escape special regex characters in a string to prevent ReDoS and regex injection.
 * Use this before passing user input to MongoDB $regex or new RegExp().
 * 
 * @param {string} str — raw user input
 * @returns {string} — escaped string safe for regex use
 */
export function escapeRegex(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validate that a string is a valid MongoDB ObjectId format (24-char hex).
 * 
 * @param {string} id
 * @returns {boolean}
 */
export function isValidObjectId(id) {
  return typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);
}
