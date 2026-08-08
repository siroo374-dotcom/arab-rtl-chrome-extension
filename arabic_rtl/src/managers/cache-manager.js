/**
 * @file cache-manager.js
 * @description Memory-safe caching system using WeakSet.
 * Prevents memory leaks while ensuring elements are not processed multiple times.
 */

window.ArabRTL = window.ArabRTL || {};
window.ArabRTL.Managers = window.ArabRTL.Managers || {};

window.ArabRTL.Managers.CacheManager = (function() {
  // WeakSet holds weak references to DOM elements.
  // If a node is removed from the DOM, it is automatically garbage collected,
  // making it perfect for single-page applications (SPAs) like React/Vue.
  let processedElements = new WeakSet();

  /**
   * Checks if an element has already been processed and is in the cache.
   * 
   * @param {HTMLElement} element - The DOM element to check.
   * @returns {boolean} True if the element is in the cache.
   */
  function has(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
    return processedElements.has(element);
  }

  /**
   * Adds an element to the cache to mark it as processed.
   * 
   * @param {HTMLElement} element - The DOM element to cache.
   */
  function add(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return;
    processedElements.add(element);
  }

  /**
   * Resets the cache entirely by creating a new WeakSet instance.
   * Useful when the extension is restarted or settings are restored.
   */
  function reset() {
    processedElements = new WeakSet();
    const logger = window.ArabRTL.Logger;
    if (logger) logger.debug('CacheManager has been reset.');
  }

  return {
    has,
    add,
    reset
  };
})();