/**
 * @file language-detector.js
 * @description Engine responsible for analyzing text content to detect Arabic characters.
 * Categorizes text as purely Arabic, Mixed, or Non-Arabic for precise processing.
 */

window.ArabRTL = window.ArabRTL || {};
window.ArabRTL.Engines = window.ArabRTL.Engines || {};

window.ArabRTL.Engines.LanguageDetector = (function() {
  const config = window.ArabRTL.Config;
  const ARABIC_REGEX = config.constants.ARABIC_REGEX;
  
  // Regex to detect English/Latin characters to identify mixed text
  const LATIN_REGEX = /[a-zA-Z]/;

  /**
   * Fast check to see if the text contains any Arabic characters.
   * 
   * @param {string} text - The text to evaluate.
   * @returns {boolean} True if Arabic characters exist, false otherwise.
   */
  function hasArabic(text) {
    if (!text || typeof text !== 'string') return false;
    return ARABIC_REGEX.test(text);
  }

  /**
   * Analyzes the text and determines its language composition.
   * 
   * @param {string} text - The text to analyze.
   * @returns {string} Returns 'arabic', 'mixed', 'none', or 'empty'.
   */
  function analyzeText(text) {
    if (!text || typeof text !== 'string') return 'empty';
    
    // Trim whitespace to avoid processing empty visual nodes
    const trimmed = text.trim();
    if (trimmed.length === 0) return 'empty';

    const containsArabic = ARABIC_REGEX.test(trimmed);
    const containsLatin = LATIN_REGEX.test(trimmed);

    if (containsArabic && containsLatin) {
      return 'mixed';
    } else if (containsArabic) {
      return 'arabic';
    }
    
    return 'none'; // Text exists but contains no Arabic (e.g., pure English)
  }

  return {
    hasArabic,
    analyzeText
  };
})();