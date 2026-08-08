/**
 * @file mixed-text.js
 * @description Plugin to fix Bi-Directional (BiDi) text issues in mixed Arabic/English paragraphs.
 * Safely isolates Latin text and corrects punctuation displacement using RLM markers.
 */

window.ArabRTL = window.ArabRTL || {};
window.ArabRTL.Plugins = window.ArabRTL.Plugins || {};

(function() {
  const PLUGIN_NAME = 'Mixed Text BiDi Fixer';
  const SETTING_KEY = 'improveMixedText';

  // Regex to detect if text contains Latin characters or numbers
  const LATIN_CHAR_REGEX = /[A-Za-z0-9]/;

  /**
   * Processes element to isolate English/Numbers inside mixed Arabic text.
   * 
   * @param {HTMLElement} element - The element being processed.
   * @param {string} textType - The type of text detected ('arabic' or 'mixed').
   */
  function processElement(element, textType) {
    // Only apply this heavy processing to elements that actually mix both languages
    if (textType !== 'mixed') return;

    // 1. Safe Inline Element Isolation
    // Isolate pure English inline elements (links, spans, bold text) inside the Arabic paragraph
    const inlineTags = ['SPAN', 'A', 'STRONG', 'B', 'EM', 'I', 'MARK', 'CODE'];
    
    Array.from(element.children).forEach(child => {
      if (inlineTags.includes(child.tagName)) {
        const childText = child.textContent || '';
        const ARABIC_REGEX = window.ArabRTL.Config.constants.ARABIC_REGEX;
        
        // If the inline element has Latin chars and NO Arabic chars, isolate it
        if (LATIN_CHAR_REGEX.test(childText) && !ARABIC_REGEX.test(childText)) {
          if (child.getAttribute('dir') !== 'ltr') {
            child.setAttribute('dir', 'ltr');
            // Using inline style here is necessary as it's a structural BiDi requirement
            child.style.setProperty('unicode-bidi', 'isolate', 'important');
          }
        }
      }
    });

    // 2. Text Node RLM (Right-to-Left Mark) Insertion
    // Fixes the issue where punctuation at the end of an English word inside Arabic jumps visually.
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    let node;
    
    while ((node = walker.nextNode())) {
      let text = node.nodeValue;
      
      // If text ends with an English word/number followed by neutral punctuation (like a period or bracket),
      // we append an invisible RLM character (\u200F) to force correct RTL rendering.
      if (/[A-Za-z0-9][\)\]}>.,:;"'!؟،؛]\s*$/.test(text)) {
        if (!text.endsWith('\u200F')) {
          node.nodeValue = text + '\u200F';
        }
      }
    }
  }

  // Register the plugin with the core system
  if (window.ArabRTL && window.ArabRTL.Plugins && window.ArabRTL.Plugins.Loader) {
    window.ArabRTL.Plugins.Loader.register({
      name: PLUGIN_NAME,
      settingKey: SETTING_KEY,
      process: processElement
    });
  }
})();