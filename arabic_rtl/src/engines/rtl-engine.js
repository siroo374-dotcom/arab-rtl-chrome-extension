/**
 * @file rtl-engine.js
 * @description Applies RTL (Right-to-Left) direction and typography classes to elements.
 * Uses CSS classes exclusively, avoiding inline styles for better performance and compatibility.
 */

window.ArabRTL = window.ArabRTL || {};
window.ArabRTL.Engines = window.ArabRTL.Engines || {};

window.ArabRTL.Engines.RTLEngine = (function() {
  const config = window.ArabRTL.Config;
  const classes = config.classes;

  /**
   * Applies RTL direction and appropriate classes to an HTML element.
   * 
   * @param {HTMLElement} element - The DOM element to process.
   * @param {string} textType - The composition of the text ('arabic' or 'mixed').
   * @param {Object} userSettings - The current active settings of the extension.
   */
  function applyRTL(element, textType, userSettings) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

    // Prevent double processing to save CPU cycles
    if (element.classList.contains(classes.processed)) return;

    // 1. Apply Direction and Alignment
    if (userSettings.improveArabicDirection) {
      // Add CSS class for styling rules
      element.classList.add(classes.rtl);
      
      // Also set the HTML dir attribute as a standard fallback for browsers
      if (element.getAttribute('dir') !== 'rtl' && element.getAttribute('dir') !== 'auto') {
        element.setAttribute('dir', 'rtl');
      }
    }

    // 2. Apply Mixed Text enhancements (for elements containing both Arabic and English)
    if (textType === 'mixed' && userSettings.improveMixedText) {
      element.classList.add(classes.mixed);
    }

    // 3. Apply Custom Typography (Alexandria Font)
    if (userSettings.useAlexandriaFont) {
      element.classList.add(classes.alexandria);
    }

    // Mark the element as processed
    element.classList.add(classes.processed);
  }

  /**
   * Reverts changes (Useful when the user disables the extension dynamically).
   * 
   * @param {HTMLElement} element - The DOM element to revert.
   */
  function removeRTL(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

    element.classList.remove(classes.rtl);
    element.classList.remove(classes.mixed);
    element.classList.remove(classes.alexandria);
    element.classList.remove(classes.processed);
    
    // Clean up the dir attribute if we added it
    if (element.getAttribute('dir') === 'rtl') {
      element.removeAttribute('dir');
    }
  }

  return {
    applyRTL,
    removeRTL
  };
})();