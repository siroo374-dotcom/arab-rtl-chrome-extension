/**
 * @file style-manager.js
 * @description Manages dynamic style injections, fonts, and theme variables.
 * Ensures CSS variables and font links are properly loaded into the target webpage.
 */

window.ArabRTL = window.ArabRTL || {};
window.ArabRTL.Managers = window.ArabRTL.Managers || {};

window.ArabRTL.Managers.StyleManager = (function() {
  const config = window.ArabRTL.Config;
  const FONT_LINK_ID = 'arab-rtl-google-fonts';
  const DYNAMIC_STYLE_ID = 'arab-rtl-dynamic-styles';

  /**
   * Injects Google Fonts (Alexandria and Inter) into the document head.
   * Uses preconnect for faster loading.
   */
  function injectFonts() {
    // Prevent injecting multiple times
    if (document.getElementById(FONT_LINK_ID)) return;

    // Preconnect to Google Fonts for performance optimization
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';

    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';

    // Load Fonts (Alexandria for Arabic, Inter for UI/English)
    const fontLink = document.createElement('link');
    fontLink.id = FONT_LINK_ID;
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap';

    document.head.appendChild(preconnect1);
    document.head.appendChild(preconnect2);
    document.head.appendChild(fontLink);
  }

  /**
   * Injects dynamic CSS variables for the theme.
   * 
   * @param {Object} settings - User settings to determine theme (Dark/Light)
   */
  function injectThemeVariables(settings) {
    let styleTag = document.getElementById(DYNAMIC_STYLE_ID);
    
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = DYNAMIC_STYLE_ID;
      document.head.appendChild(styleTag);
    }

    const colors = config.theme.colors;
    const shadows = config.theme.shadows;
    
    // Inject variables into :root to be used by our CSS file
    const cssVariables = `
      :root {
        --arab-rtl-neon-green: ${colors.neonGreen};
        --arab-rtl-dark-bg: ${colors.darkBackground};
        --arab-rtl-glass-bg: ${colors.glassBackground};
        --arab-rtl-text-primary: ${colors.textPrimary};
        --arab-rtl-text-secondary: ${colors.textSecondary};
        --arab-rtl-border-soft: ${colors.borderSoft};
        --arab-rtl-shadow-neon: ${shadows.neon};
        --arab-rtl-shadow-glass: ${shadows.glass};
      }
    `;

    styleTag.textContent = cssVariables;
    
    // Set a global attribute on HTML tag to enable dark mode specific overrides
    if (settings.darkTheme) {
      document.documentElement.setAttribute('data-arab-rtl-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-arab-rtl-theme');
    }
  }

  /**
   * Initializes the style manager based on user settings.
   * 
   * @param {Object} settings - The current extension settings.
   */
  function init(settings) {
    if (!settings || !settings.enableExtension) return;
    
    if (settings.useAlexandriaFont) {
      injectFonts();
    }
    
    injectThemeVariables(settings);
    
    const logger = window.ArabRTL.Logger;
    if (logger) logger.info('Style Manager initialized.');
  }

  /**
   * Removes injected styles and fonts (used when the extension is disabled dynamically).
   */
  function cleanup() {
    const fontLink = document.getElementById(FONT_LINK_ID);
    if (fontLink) fontLink.remove();

    const styleTag = document.getElementById(DYNAMIC_STYLE_ID);
    if (styleTag) styleTag.remove();
    
    document.documentElement.removeAttribute('data-arab-rtl-theme');
  }

  return {
    init,
    cleanup
  };
})();