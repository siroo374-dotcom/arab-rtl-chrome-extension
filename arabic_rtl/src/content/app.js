/**
 * @file app.js
 * @description The main application controller.
 * Orchestrates the startup sequence, loads settings, and listens for dynamic updates.
 */

window.ArabRTL = window.ArabRTL || {};

window.ArabRTL.App = (function() {
  const Config = window.ArabRTL.Config;
  const getLogger = () => window.ArabRTL.Logger;
  const getStyleManager = () => window.ArabRTL.Managers.StyleManager;
  const getDOMManager = () => window.ArabRTL.Managers.DOMManager;
  const getPluginLoader = () => window.ArabRTL.Plugins.Loader;
  const getCache = () => window.ArabRTL.Managers.CacheManager;

  let currentSettings = { ...Config.defaultSettings };

  /**
   * Starts the extension core functionality based on settings.
   */
  function start() {
    if (!currentSettings.enableExtension) {
      getLogger().info('Extension is disabled in settings.');
      return;
    }

    getLogger().info('Starting Arab RTL App...');

    // 1. Initialize Styles (Fonts, Variables)
    getStyleManager().init(currentSettings);

    // 2. Initialize Plugins
    getPluginLoader().initAll(currentSettings);

    // 3. Start DOM Monitoring and Processing
    getDOMManager().start(currentSettings);
  }

  /**
   * Stops all extension activities and cleans up modified DOM elements.
   */
  function stop() {
    getLogger().info('Stopping Arab RTL App...');
    getDOMManager().stop();
    getStyleManager().cleanup();
    getCache().reset();
  }

  /**
   * Handles dynamic setting changes from popup or options page.
   * Ensures instant updates without requiring a page reload.
   */
  function handleStorageChange(changes, namespace) {
    if (namespace !== 'sync') return;

    let settingsChanged = false;
    
    for (let [key, { newValue }] of Object.entries(changes)) {
      if (currentSettings.hasOwnProperty(key) && currentSettings[key] !== newValue) {
        currentSettings[key] = newValue;
        settingsChanged = true;
      }
    }

    if (settingsChanged) {
      getLogger().info('Settings updated dynamically. Reloading extension state...');
      stop();
      if (currentSettings.enableExtension) {
        start();
        // Force re-process the entire body to apply new settings immediately
        getDOMManager().processTree(document.body);
      }
    }
  }

  /**
   * Initializes the application by fetching user settings from Chrome Storage.
   */
  function init() {
    getLogger().info('Initializing Arab RTL...');

    // Load settings from Chrome Storage Sync (syncs across user's devices)
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(Config.defaultSettings, (items) => {
        currentSettings = { ...Config.defaultSettings, ...items };
        start();
      });

      // Listen for real-time setting changes
      chrome.storage.onChanged.addListener(handleStorageChange);
    } else {
      // Fallback in case storage API is somehow unavailable
      getLogger().warn('Chrome storage API not found. Using default settings.');
      start();
    }
  }

  return {
    init
  };
})();