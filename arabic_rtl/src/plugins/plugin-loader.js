/**
 * @file plugin-loader.js
 * @description Central registry and executor for modular plugins.
 * Follows the Open/Closed Principle to allow future expansions seamlessly.
 */

window.ArabRTL = window.ArabRTL || {};
window.ArabRTL.Plugins = window.ArabRTL.Plugins || {};

window.ArabRTL.Plugins.Loader = (function() {
  const registeredPlugins = [];
  const getLogger = () => window.ArabRTL.Logger;

  /**
   * Registers a new plugin to the system.
   * 
   * @param {Object} plugin - The plugin object.
   * @param {string} plugin.name - Name of the plugin.
   * @param {Function} plugin.init - Initialization function (runs once).
   * @param {Function} plugin.process - Processing function for elements.
   * @param {string} plugin.settingKey - The key in userSettings that enables/disables this plugin.
   */
  function register(plugin) {
    if (!plugin || !plugin.name || typeof plugin.process !== 'function') {
      getLogger().warn('Attempted to register an invalid plugin.');
      return;
    }
    
    registeredPlugins.push(plugin);
    getLogger().debug(`Plugin registered: ${plugin.name}`);
  }

  /**
   * Initializes all registered plugins based on current settings.
   * 
   * @param {Object} settings - Current user settings.
   */
  function initAll(settings) {
    if (!settings) return;

    registeredPlugins.forEach(plugin => {
      // Only initialize if the user has enabled this feature in settings
      if (plugin.settingKey && settings[plugin.settingKey] !== false) {
        if (typeof plugin.init === 'function') {
          try {
            plugin.init(settings);
          } catch (error) {
            getLogger().error(`Error initializing plugin ${plugin.name}:`, error);
          }
        }
      }
    });
    getLogger().info(`Initialized ${registeredPlugins.length} plugins.`);
  }

  /**
   * Applies all active plugins to a specific DOM element.
   * 
   * @param {HTMLElement} element - The element to process.
   * @param {string} textType - Type of text ('arabic', 'mixed', etc.)
   * @param {Object} settings - Current user settings.
   */
  function applyPlugins(element, textType, settings) {
    if (!element || !settings) return;

    registeredPlugins.forEach(plugin => {
      // Check if the plugin is enabled in settings before executing
      if (plugin.settingKey && settings[plugin.settingKey] === false) {
        return;
      }

      try {
        plugin.process(element, textType);
      } catch (error) {
        getLogger().error(`Error in plugin ${plugin.name} while processing element:`, error);
      }
    });
  }

  return {
    register,
    initAll,
    applyPlugins
  };
})();