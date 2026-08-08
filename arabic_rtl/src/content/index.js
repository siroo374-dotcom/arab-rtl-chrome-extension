/**
 * @file index.js
 * @description The entry point for the content script.
 * Bootstraps the application once the DOM is ready.
 */

(function bootstrap() {
  // Ensure the core App module exists before trying to initialize
  if (window.ArabRTL && window.ArabRTL.App) {
    // The manifest is set to run_at: "document_idle", so the DOM is already fully loaded.
    // However, it's a good practice to check if the document is ready.
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', window.ArabRTL.App.init);
    } else {
      window.ArabRTL.App.init();
    }
  } else {
    console.error('[Arab RTL] Critical Error: Core application modules failed to load.');
  }
})();