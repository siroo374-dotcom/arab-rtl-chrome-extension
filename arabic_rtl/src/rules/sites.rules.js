/**
 * @file sites.rules.js
 * @description Specific rules and selectors for popular sites.
 * Allows custom targeting for AI chats and social media without modifying the core engine.
 */

window.ArabRTL = window.ArabRTL || {};
window.ArabRTL.Rules = window.ArabRTL.Rules || {};

window.ArabRTL.Rules.Sites = (function() {
  // Map of domain names to their specific processing rules
  const siteRules = {
    'chatgpt.com': {
      name: 'ChatGPT',
      // Target specific message containers to optimize performance
      targetSelectors: ['.message', '.markdown', 'div[data-message-author-role]']
    },
    'gemini.google.com': {
      name: 'Google Gemini',
      targetSelectors: ['message-content', '.model-response-text', '.message-text']
    },
    'claude.ai': {
      name: 'Claude',
      targetSelectors: ['.font-user-message', '.font-claude-message', '.grid-cols-1']
    },
    'chat.deepseek.com': {
      name: 'DeepSeek',
      targetSelectors: ['.ds-markdown', '.chat-message', '.ds-typography']
    },
    'copilot.microsoft.com': {
      name: 'Microsoft Copilot',
      targetSelectors: ['.ac-textBlock', 'cib-message']
    },
    'facebook.com': {
      name: 'Facebook',
      targetSelectors: ['div[dir="auto"]', 'span[dir="auto"]']
    },
    'x.com': {
      name: 'Twitter/X',
      targetSelectors: ['div[lang="ar"]', 'div[data-testid="tweetText"]']
    },
    'twitter.com': {
      name: 'Twitter',
      targetSelectors: ['div[lang="ar"]', 'div[data-testid="tweetText"]']
    },
    'linkedin.com': {
      name: 'LinkedIn',
      targetSelectors: ['.feed-shared-update-v2__description', '.comments-comment-item__main-content']
    },
    'reddit.com': {
      name: 'Reddit',
      targetSelectors: ['.RichTextJSON-root', 'div[data-testid="post-container"]', 'shreddit-comment']
    },
    'github.com': {
      name: 'GitHub',
      targetSelectors: ['.comment-body', '.markdown-body', '.commit-title']
    },
    'stackoverflow.com': {
      name: 'StackOverflow',
      targetSelectors: ['.s-prose', '.comment-copy']
    },
    'wikipedia.org': {
      name: 'Wikipedia',
      targetSelectors: ['.mw-parser-output p', '.mw-parser-output li']
    },
    'youtube.com': {
      name: 'YouTube',
      targetSelectors: ['#content-text', '#title', '.yt-core-attributed-string']
    },
    'medium.com': {
      name: 'Medium',
      targetSelectors: ['article p', 'article h1', 'article h2', 'article h3', 'article li']
    }
  };

  /**
   * Retrieves specific rules based on the current hostname.
   * Checks if the current window location matches any defined domain.
   * 
   * @param {string} hostname - The domain name (e.g., window.location.hostname)
   * @returns {Object|null} Configuration for the site or null if no specific rules exist.
   */
  function getConfig(hostname) {
    for (const domain in siteRules) {
      // Use includes() to match subdomains as well (e.g. chat.deepseek.com)
      if (hostname.includes(domain)) {
        return siteRules[domain];
      }
    }
    // Return null to fallback to the default global DOM processing
    return null; 
  }

  return {
    getConfig,
    getAllRules: () => siteRules
  };
})();