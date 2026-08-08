/**
 * @file logger.js
 * @description Professional logging system for Arab RTL.
 * Operates only in development mode to ensure zero performance cost in production.
 */

window.ArabRTL = window.ArabRTL || {};

window.ArabRTL.Logger = (function() {
  const config = window.ArabRTL.Config;
  const PREFIX = '[Arab RTL]';
  
  // Styles for console output to make logs distinct and easy to read
  const STYLES = {
    info: 'color: #00FF41; font-weight: bold;',   // Neon Green
    warn: 'color: #F0E68C; font-weight: bold;',   // Khaki/Yellow
    error: 'color: #FF6347; font-weight: bold;',  // Tomato/Red
    debug: 'color: #8B949E; font-weight: bold;'   // Gray
  };

  /**
   * Internal method to process and style logs
   * @param {string} level - Log level (info, warn, error, debug)
   * @param {string} message - The main log message
   * @param {any} [data] - Optional data or object to log
   */
  function logMessage(level, message, data = null) {
    // Stop completely if not in development mode
    if (!config.env.isDevelopment) return;

    const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
    const style = STYLES[level] || STYLES.info;

    if (data !== null) {
      console[consoleMethod](`%c${PREFIX} ${message}`, style, data);
    } else {
      console[consoleMethod](`%c${PREFIX} ${message}`, style);
    }
  }

  return {
    info: (message, data) => logMessage('info', message, data),
    warn: (message, data) => logMessage('warn', message, data),
    error: (message, data) => logMessage('error', message, data),
    debug: (message, data) => logMessage('debug', message, data),
    
    /**
     * Starts a timer for performance tracking
     * @param {string} label 
     */
    time: (label) => {
      if (config.env.isDevelopment) console.time(`${PREFIX} ${label}`);
    },
    
    /**
     * Ends the timer and logs the elapsed time
     * @param {string} label 
     */
    timeEnd: (label) => {
      if (config.env.isDevelopment) console.timeEnd(`${PREFIX} ${label}`);
    }
  };
})();