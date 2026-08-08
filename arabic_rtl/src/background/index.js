/**
 * @file index.js
 * @description Background Service Worker for Manifest V3.
 * Handles extension lifecycle events (installation, updates) and initializes default state.
 */

// We duplicate default settings here because the background script runs in total isolation 
// from the content scripts and cannot access window.ArabRTL.Config directly.
const defaultSettings = {
  enableExtension: true,
  autoDetection: true,
  improveArabicDirection: true,
  improveMixedText: true,
  improvePunctuation: true,
  improveLists: true,
  improveTables: true,
  useAlexandriaFont: true,
  darkTheme: true
};

/**
 * Triggered when the extension is installed or updated.
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[Arab RTL] Extension installed successfully.');
    
    // Initialize default settings in Chrome sync storage
    // This ensures settings are synced across the user's devices if they are logged into Chrome
    chrome.storage.sync.get(defaultSettings, (items) => {
      chrome.storage.sync.set(items, () => {
        console.log('[Arab RTL] Default settings initialized in storage.');
      });
    });
  } else if (details.reason === 'update') {
    console.log(`[Arab RTL] Extension updated from version ${details.previousVersion}.`);
  }
});

/**
 * Optional message listener for future expandability.
 * Useful if popup or content scripts need to ask the background script to perform a task
 * (e.g., bypassing CORS to fetch data, or communicating with other APIs).
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ping') {
    sendResponse({ status: 'Active' });
  }
  // Returning true keeps the message channel open for asynchronous responses
  return true; 
});