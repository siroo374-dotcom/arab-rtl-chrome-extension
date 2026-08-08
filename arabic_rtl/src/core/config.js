/**
 * @file config.js
 * @description Central configuration for Arab RTL extension.
 * Implements a Single Source of Truth for settings, constants, and system state.
 */

window.ArabRTL = window.ArabRTL || {};

window.ArabRTL.Config = {
  // Default User Settings
  defaultSettings: {
    enableExtension: true,
    autoDetection: true,
    improveArabicDirection: true,
    improveMixedText: true,
    improvePunctuation: true,
    improveLists: true,
    improveTables: true,
    useAlexandriaFont: true,
    darkTheme: true
  },

  // System Constants
  constants: {
    // Regex to detect Arabic Unicode Blocks
    ARABIC_REGEX: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/,
    
    // Performance Limits
    MAX_PROCESSING_TIME_MS: 15, // Maximum time allowed for DOM processing per frame
    DEBOUNCE_DELAY_MS: 150,     // Debouncing delay for DOM mutations
    THROTTLE_DELAY_MS: 100,     // Throttling delay for scroll/resize events
    
    // Limits
    MAX_CACHE_SIZE: 5000        // Maximum number of elements to keep in WeakMap/WeakSet
  },

  // Environment Settings
  env: {
    // Set to false for Production to completely disable Logger
    isDevelopment: true 
  },

  // CSS Classes injected by the extension
  classes: {
    processed: 'arab-rtl-processed', // Flag to prevent double processing
    rtl: 'arab-rtl-direction',
    mixed: 'arab-rtl-mixed-text',
    alexandria: 'arab-rtl-font-alexandria',
    ignore: 'arab-rtl-ignore'
  },

  // CSS Variables for the UI and injected styles
  theme: {
    colors: {
      neonGreen: '#00FF41',
      darkBackground: '#0D1117',
      glassBackground: 'rgba(13, 17, 23, 0.7)',
      textPrimary: '#E6EDF3',
      textSecondary: '#8B949E',
      borderSoft: 'rgba(48, 54, 61, 0.5)'
    },
    shadows: {
      neon: '0 0 10px rgba(0, 255, 65, 0.3)',
      glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
    }
  }
};