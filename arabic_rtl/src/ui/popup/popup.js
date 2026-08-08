/**
 * @file popup.js
 * @description Logic for the popup window.
 * Injects icons, retrieves current active tab data, and handles user interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inject Icons dynamically from the Icons repository
  const icons = window.ArabRTL.Icons;
  if (icons) {
    const logoContainer = document.getElementById('logo-container');
    const settingsIcon = document.getElementById('settings-icon');
    
    if (logoContainer) logoContainer.innerHTML = icons.logo;
    if (settingsIcon) settingsIcon.innerHTML = icons.settings;
  }

  // 2. Fetch the current active tab to display the website domain
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentSiteElement = document.getElementById('current-site');
      
      if (tabs && tabs[0] && tabs[0].url) {
        try {
          const url = new URL(tabs[0].url);
          
          // Ignore chrome:// or edge:// internal pages
          if (url.protocol === 'chrome:' || url.protocol === 'edge:') {
            currentSiteElement.textContent = 'Browser Page';
            return;
          }
          
          // Remove 'www.' for a cleaner, minimal look
          const hostname = url.hostname.replace(/^www\./, '');
          currentSiteElement.textContent = hostname || 'Unknown Site';
        } catch (e) {
          currentSiteElement.textContent = 'Local Page';
        }
      } else {
        currentSiteElement.textContent = 'New Tab';
      }
    });
  }

  // 3. Handle Settings Button Click
  const settingsBtn = document.getElementById('settings-btn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      // Standard way to open the extension's options page in Chrome Manifest V3
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        // Fallback just in case
        window.open(chrome.runtime.getURL('src/ui/settings/settings.html'));
      }
    });
  }
});