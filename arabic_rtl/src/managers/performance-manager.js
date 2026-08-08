/**
 * @file performance-manager.js
 * @description High-performance utility functions for controlling execution frequency.
 * Implements Debounce, Throttle, and requestAnimationFrame wrappers to ensure 60fps.
 */

window.ArabRTL = window.ArabRTL || {};
window.ArabRTL.Managers = window.ArabRTL.Managers || {};

window.ArabRTL.Managers.PerformanceManager = (function() {
  
  /**
   * Delays the execution of a function until after a specific time has elapsed
   * since the last time it was invoked. 
   * Perfect for events like Window Resize or DOM insertion bursts.
   * 
   * @param {Function} func - The function to debounce
   * @param {number} wait - The delay in milliseconds
   * @returns {Function} - The debounced function
   */
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Ensures a function is called at most once in a specified time period.
   * Crucial for high-frequency events like Scrolling or rapid MutationObserver triggers.
   * 
   * @param {Function} func - The function to throttle
   * @param {number} limit - The time limit in milliseconds
   * @returns {Function} - The throttled function
   */
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }

  /**
   * Schedules a DOM manipulation task to run in the next animation frame.
   * This prevents layout thrashing and ensures the browser renders smoothly.
   * 
   * @param {Function} task - The DOM update function to execute
   */
  function scheduleDOMUpdate(task) {
    window.requestAnimationFrame(() => {
      task();
    });
  }

  return {
    debounce,
    throttle,
    scheduleDOMUpdate
  };
})();