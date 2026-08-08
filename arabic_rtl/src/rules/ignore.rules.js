/**
 * @file ignore.rules.js
 * @description Defines rules for elements that must NEVER be modified.
 * Protects code blocks, inputs, and code editors from being altered.
 */

window.ArabRTL = window.ArabRTL || {};
window.ArabRTL.Rules = window.ArabRTL.Rules || {};

window.ArabRTL.Rules.Ignore = (function() {
  // A combined CSS selector for all elements that must be ignored
  // This approach utilizes the browser's highly optimized native engine (C++) for matching
  const IGNORE_SELECTOR = [
    // Core HTML Tags
    'code',
    'pre',
    'textarea',
    'input',
    'iframe',
    'script',
    'style',
    'noscript',
    'canvas',
    'svg',
    
    // Famous Code Editors (Monaco, CodeMirror, Ace)
    '.monaco-editor', 
    '.CodeMirror',    
    '.cm-editor',     
    '.ace_editor',    
    
    // Development / GitHub specific code classes
    '.blob-code',
    '.blob-wrapper',
    
    // Explicit ignore class (for manual exclusions if needed)
    '.arab-rtl-ignore'
  ].join(', ');

  /**
   * Main function to determine if an element MUST be ignored
   * Checks the element itself and all its parents using native .closest()
   * @param {HTMLElement} element 
   * @returns {boolean} True if the element should NOT be processed
   */
  function shouldIgnore(element) {
    // We only process element nodes. 
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return true; 
    }

    // closest() checks the element itself and all ancestors up to the document root.
    // If it finds a match, it means this element is (or is inside) a protected zone.
    return element.closest(IGNORE_SELECTOR) !== null;
  }

  return {
    shouldIgnore,
    IGNORE_SELECTOR // Exported in case it's needed by other modules (like DOM Manager)
  };
})();