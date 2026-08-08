/**
 * @file settings.js
 * @description Logic for the settings page.
 * Handles reading and writing user preferences to chrome.storage.sync.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Default Settings (Fallback)
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

  // 1. Inject Icons
  const icons = window.ArabRTL.Icons;
  if (icons) {
    const logoContainer = document.getElementById('logo-container');
    const restoreIcon = document.getElementById('restore-icon');
    const checkIcon = document.getElementById('check-icon');
    
    if (logoContainer) logoContainer.innerHTML = icons.logo;
    if (restoreIcon) restoreIcon.innerHTML = icons.restore;
    if (checkIcon) checkIcon.innerHTML = icons.check;
  }

  const saveStatus = document.getElementById('save-status');
  let statusTimeout;

  /**
   * Shows the "Saved" animation briefly.
   */
  function showSavedStatus() {
    if (!saveStatus) return;
    saveStatus.classList.remove('hidden');
    
    clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => {
      saveStatus.classList.add('hidden');
    }, 2000);
  }

  /**
   * Updates the UI toggle switches based on a settings object.
   * @param {Object} settings - The settings object
   */
  function updateUI(settings) {
    Object.keys(defaultSettings).forEach(key => {
      const checkbox = document.getElementById(key);
      if (checkbox) {
        // If the setting is undefined in storage, fallback to default (true)
        checkbox.checked = settings[key] !== false; 
      }
    });
  }

  /**
   * Saves the current UI state to Chrome Storage.
   */
  function saveSettings() {
    const newSettings = {};
    Object.keys(defaultSettings).forEach(key => {
      const checkbox = document.getElementById(key);
      if (checkbox) {
        newSettings[key] = checkbox.checked;
      } else {
        newSettings[key] = defaultSettings[key];
      }
    });

    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set(newSettings, () => {
        showSavedStatus();
      });
    }
  }

  // 2. Load Initial Settings
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.get(defaultSettings, (items) => {
      updateUI(items);
    });
  } else {
    // Fallback for local testing in normal browser tab (without Chrome API)
    updateUI(defaultSettings);
  }

  // 3. Listen for Changes on all toggles
  Object.keys(defaultSettings).forEach(key => {
    const checkbox = document.getElementById(key);
    if (checkbox) {
      checkbox.addEventListener('change', saveSettings);
    }
  });

  // 4. Restore Defaults Button
  const restoreBtn = document.getElementById('restore-btn');
  if (restoreBtn) {
    restoreBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to restore all settings to their default values?')) {
        if (typeof chrome !== 'undefined' && chrome.storage) {
          chrome.storage.sync.set(defaultSettings, () => {
            updateUI(defaultSettings);
            showSavedStatus();
          });
        } else {
          updateUI(defaultSettings);
        }
      }
    });
  }
});