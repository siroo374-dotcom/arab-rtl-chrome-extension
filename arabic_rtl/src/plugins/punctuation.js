/**
 * @file punctuation.js
 * @description Plugin to correct Arabic punctuation marks.
 * Safely converts Latin commas, semicolons, and question marks to Arabic equivalents.
 */

window.ArabRTL = window.ArabRTL || {};
window.ArabRTL.Plugins = window.ArabRTL.Plugins || {};

(function() {
  const PLUGIN_NAME = 'Arabic Punctuation Enhancer';
  const SETTING_KEY = 'improvePunctuation'; // Corresponds to the key in config.js

  /**
   * Safely processes text nodes within an element to replace punctuation.
   * Uses TreeWalker for maximum performance and to avoid breaking DOM HTML.
   * 
   * @param {HTMLElement} element - The element being processed.
   * @param {string} textType - The type of text detected ('arabic' or 'mixed').
   */
  function processElement(element, textType) {
    // Only process if the text actually contains Arabic
    if (textType !== 'arabic' && textType !== 'mixed') return;

    // Create a TreeWalker to iterate ONLY over Text Nodes
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while ((node = walker.nextNode())) {
      let text = node.nodeValue;
      let changed = false;

      // 1. Replace English question mark with Arabic question mark
      if (text.includes('?')) {
        text = text.replace(/\?/g, '؟');
        changed = true;
      }

      // 2. Replace English comma with Arabic comma 
      // (Using Regex to avoid replacing decimal points in numbers like 1,000)
      if (text.includes(',')) {
        // Matches a comma followed by a space or end of string, OR preceded by non-digit
        text = text.replace(/([^\d]),(\s|$)/g, '$1،$2');
        changed = true;
      }

      // 3. Replace English semicolon with Arabic semicolon
      if (text.includes(';')) {
         text = text.replace(/;/g, '؛');
         changed = true;
      }

      // Update the node only if a change was made to save DOM operations
      if (changed) {
        node.nodeValue = text;
      }
    }
  }

  // Self-register the plugin with the Loader
  if (window.ArabRTL && window.ArabRTL.Plugins && window.ArabRTL.Plugins.Loader) {
    window.ArabRTL.Plugins.Loader.register({
      name: PLUGIN_NAME,
      settingKey: SETTING_KEY,
      process: processElement
    });
  }
})();