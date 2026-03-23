/**
 * Safe Helper Functions
 * Utility functions to prevent crashes and handle edge cases
 */

/**
 * Safely access nested object properties
 * @param {Object} obj - The object to access
 * @param {string} path - Dot-notation path (e.g., 'user.profile.name')
 * @param {*} defaultValue - Default value if path doesn't exist
 * @returns {*} The value or default
 */
export function safeGet(obj, path, defaultValue = null) {
  if (!obj || typeof obj !== 'object') return defaultValue;
  
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return defaultValue;
    }
  }
  
  return result === undefined ? defaultValue : result;
}

/**
 * Safely parse JSON with fallback
 * @param {string} jsonString - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} Parsed object or default value
 */
export function safeJsonParse(jsonString, defaultValue = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('JSON parse error:', error);
    return defaultValue;
  }
}

/**
 * Safely stringify JSON
 * @param {*} value - Value to stringify
 * @param {string} defaultValue - Default value if stringify fails
 * @returns {string} JSON string or default value
 */
export function safeJsonStringify(value, defaultValue = '{}') {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.warn('JSON stringify error:', error);
    return defaultValue;
  }
}

/**
 * Safely access localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Stored value or default
 */
export function safeLocalStorageGet(key, defaultValue = null) {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? safeJsonParse(item, defaultValue) : defaultValue;
  } catch (error) {
    console.warn('localStorage get error:', error);
    return defaultValue;
  }
}

/**
 * Safely set localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export function safeLocalStorageSet(key, value) {
  if (typeof window === 'undefined') return false;
  
  try {
    const stringValue = typeof value === 'string' ? value : safeJsonStringify(value);
    localStorage.setItem(key, stringValue);
    return true;
  } catch (error) {
    console.warn('localStorage set error:', error);
    return false;
  }
}

/**
 * Safely remove from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export function safeLocalStorageRemove(key) {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn('localStorage remove error:', error);
    return false;
  }
}

/**
 * Ensure array (convert to array if not already)
 * @param {*} value - Value to convert
 * @returns {Array} Array value
 */
export function ensureArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
}

/**
 * Safely get first item from array
 * @param {Array} arr - Array
 * @param {*} defaultValue - Default value
 * @returns {*} First item or default
 */
export function safeFirst(arr, defaultValue = null) {
  return Array.isArray(arr) && arr.length > 0 ? arr[0] : defaultValue;
}

/**
 * Safely get last item from array
 * @param {Array} arr - Array
 * @param {*} defaultValue - Default value
 * @returns {*} Last item or default
 */
export function safeLast(arr, defaultValue = null) {
  return Array.isArray(arr) && arr.length > 0 ? arr[arr.length - 1] : defaultValue;
}

/**
 * Clamp number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Format date safely
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date or fallback
 */
export function safeFormatDate(date, locale = 'en-US', options = {}) {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return 'Invalid Date';
    
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    }).format(dateObj);
  } catch (error) {
    console.warn('Date format error:', error);
    return String(date);
  }
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Generate unique ID
 * @param {string} prefix - Optional prefix
 * @returns {string} Unique ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if value is empty
 * @param {*} value - Value to check
 * @returns {boolean} True if empty
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Safely truncate string
 * @param {string} str - String to truncate
 * @param {number} length - Max length
 * @param {string} suffix - Suffix to add
 * @returns {string} Truncated string
 */
export function truncate(str, length = 50, suffix = '...') {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
}

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return num.toLocaleString();
}

/**
 * Percentage calculator
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @param {number} decimals - Decimal places
 * @returns {number} Percentage
 */
export function calculatePercentage(value, total, decimals = 0) {
  if (!total || total === 0) return 0;
  const percentage = (value / total) * 100;
  return parseFloat(percentage.toFixed(decimals));
}

/**
 * Deep clone object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export function deepClone(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.warn('Deep clone error:', error);
    return obj;
  }
}

export default {
  safeGet,
  safeJsonParse,
  safeJsonStringify,
  safeLocalStorageGet,
  safeLocalStorageSet,
  safeLocalStorageRemove,
  ensureArray,
  safeFirst,
  safeLast,
  clamp,
  safeFormatDate,
  debounce,
  throttle,
  generateId,
  isEmpty,
  truncate,
  capitalize,
  formatNumber,
  calculatePercentage,
  deepClone,
};
