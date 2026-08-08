/**
 * @file dom-manager.js
 * @description The core engine that scans the document and observes DOM mutations.
 * Connects the RuleEngine, CacheManager, and RTLEngine to process elements safely.
 */

window.ArabRTL = window.ArabRTL || {};
window.ArabRTL.Managers = window.ArabRTL.Managers || {};

window.ArabRTL.Managers.DOMManager = (function() {
  let observer = null;
  
  // Dynamic references to other modules
  const Config = window.ArabRTL.Config;
  const getPerformance = () => window.ArabRTL.Managers.PerformanceManager;
  const getCache = () => window.ArabRTL.Managers.CacheManager;
  const getRules = () => window.ArabRTL.Engines.RuleEngine;
  const getRTL = () => window.ArabRTL.Engines.RTLEngine;
  const getSites = () => window.ArabRTL.Rules.Sites;
  const getLogger = () => window.ArabRTL.Logger;

  let currentSettings = Config.defaultSettings;
  let siteConfig = null;

  // The elements we want to inspect if no specific site rules are active
  const GLOBAL_TARGET_SELECTORS = 'p, h1, h2, h3, h4, h5, h6, div, span, li, a, td, th, blockquote, article, section';

  /**
   * Processes a single HTML element.
   * 
   * @param {HTMLElement} element - The element to process.
   * @param {boolean} force - If true, bypasses the cache to force re-evaluation.
   */
  function processElement(element, force = false) {
    if (!force && getCache().has(element)) return;

    if (!getRules().isEligibleElement(element)) {
      // Mark as processed in cache so we don't check this invalid element again
      getCache().add(element);
      return;
    }

    const textType = getRules().evaluateElementText(element);

    // Schedule the actual DOM modification to the next animation frame for performance
    getPerformance().scheduleDOMUpdate(() => {
      if (textType === 'arabic' || textType === 'mixed') {
        getRTL().applyRTL(element, textType, currentSettings);
      } else if (force) {
        // If text was deleted or changed to English, remove RTL classes
        getRTL().removeRTL(element);
      }
      // Always add to cache after checking to prevent endless loops
      getCache().add(element);
    });
  }

  /**
   * Processes a node and all its child elements.
   * 
   * @param {HTMLElement} rootNode - The root node to scan.
   */
  function processTree(rootNode) {
    if (!rootNode || !rootNode.querySelectorAll) return;

    let targetElements = [];
    let selector = GLOBAL_TARGET_SELECTORS;

    // Use specific site selectors if available (Faster processing)
    if (siteConfig && siteConfig.targetSelectors) {
      selector = siteConfig.targetSelectors.join(', ');
    }

    try {
      // Check the root node itself first
      if (rootNode.matches && rootNode.matches(selector)) {
        processElement(rootNode);
      }
      
      // Find all matching children
      targetElements = rootNode.querySelectorAll(selector);
      targetElements.forEach(el => processElement(el));
    } catch (e) {
      getLogger().error('Error scanning tree:', e);
    }
  }

  /**
   * Callback for MutationObserver to handle new nodes added to the page.
   * Wrapped in throttle to avoid locking the main thread during heavy DOM updates.
   */
  const handleMutations = function(mutations) {
    // Throttle the actual execution
    getPerformance().throttle(() => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          // Handle newly added elements (e.g., new chat messages)
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              processTree(node);
            } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
              processElement(node.parentElement);
            }
          });
        } else if (mutation.type === 'characterData') {
          // Handle text changes within existing elements (typing effect like ChatGPT)
          if (mutation.target.parentElement) {
            processElement(mutation.target.parentElement, true); // force re-evaluation
          }
        }
      });
    }, Config.constants.THROTTLE_DELAY_MS)();
  };

  /**
   * Starts monitoring the page and processing existing content.
   * 
   * @param {Object} settings - User settings object.
   */
  function start(settings) {
    currentSettings = settings || Config.defaultSettings;
    
    if (!currentSettings.enableExtension) return;

    // Identify if we are on a specific site with custom rules
    siteConfig = getSites().getConfig(window.location.hostname);
    if (siteConfig) {
      getLogger().info(`Applying custom optimized rules for: ${siteConfig.name}`);
    } else {
      getLogger().info('Applying generic DOM rules.');
    }

    // 1. Process existing elements on the page
    getLogger().time('Initial DOM Scan');
    processTree(document.body);
    getLogger().timeEnd('Initial DOM Scan');

    // 2. Start MutationObserver for future changes
    if (!observer) {
      observer = new MutationObserver(handleMutations);
    }

    observer.observe(document.body, {
      childList: true,         // Watch for new elements
      subtree: true,           // Watch the entire document body
      characterData: true      // Watch for text changes inside elements
    });

    getLogger().info('DOM Manager started successfully.');
  }

  /**
   * Stops observing the page.
   */
  function stop() {
    if (observer) {
      observer.disconnect();
      getLogger().info('DOM Manager stopped.');
    }
  }

  return {
    start,
    stop,
    processTree
  };
})();