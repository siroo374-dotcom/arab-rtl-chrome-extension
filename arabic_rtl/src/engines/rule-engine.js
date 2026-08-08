/**
 * @file rule-engine.js
 * @description Coordinates rules to determine if an element should be processed.
 * Acts as the brain that connects the language detector with ignore rules.
 */

window.ArabRTL = window.ArabRTL || {};
window.ArabRTL.Engines = window.ArabRTL.Engines || {};

window.ArabRTL.Engines.RuleEngine = (function() {
  const config = window.ArabRTL.Config;
  
  // We will access these dynamically to ensure they are loaded
  function getIgnoreRules() {
    return window.ArabRTL.Rules.Ignore;
  }
  
  function getLanguageDetector() {
    return window.ArabRTL.Engines.LanguageDetector;
  }

  /**
   * Determines if an element is strictly eligible for processing.
   * Checks element type, processed state, and ignore rules.
   * 
   * @param {HTMLElement} element - The DOM element to check.
   * @returns {boolean} True if the element is safe and ready to be processed.
   */
  function isEligibleElement(element) {
    // Must be a valid HTML Element node
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    // Skip if already processed (Performance optimization)
    if (element.classList.contains(config.classes.processed)) {
      return false;
    }

    // Apply strict ignore rules (Code editors, textareas, iframes, etc.)
    if (getIgnoreRules().shouldIgnore(element)) {
      return false;
    }

    return true;
  }

  /**
   * Evaluates the text content of an element to decide if it needs RTL treatment.
   * 
   * @param {HTMLElement} element - The element to evaluate.
   * @returns {string} Returns 'arabic', 'mixed', 'none', or 'empty'.
   */
  function evaluateElementText(element) {
    if (!element) return 'empty';
    
    // Using textContent to evaluate the raw text inside the element
    const text = element.textContent || '';
    return getLanguageDetector().analyzeText(text);
  }

  return {
    isEligibleElement,
    evaluateElementText
  };
})();