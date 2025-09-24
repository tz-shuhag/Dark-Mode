function applyDarkMode() {
  const css = `
    /* Global dark mode filter */
    html.dark-mode-on {
      filter: invert(100%) hue-rotate(180deg);
      background-color: #fcfcfc;
    }

    /* Re-invert common media and image elements */
    html.dark-mode-on img,
    html.dark-mode-on video,
    html.dark-mode-on picture,
    html.dark-mode-on iframe,
    html.dark-mode-on svg {
      filter: invert(100%) hue-rotate(180deg) !important;
    }
    
    /* Re-invert specific Daraz image classes to fix common issues */
    html.dark-mode-on .ant-image-img,
    html.dark-mode-on .LazyLoadIsLoaded img {
      filter: invert(100%) hue-rotate(180deg) !important;
    }
  `;
  const style = document.createElement('style');
  style.id = 'dark-mode-style';
  style.textContent = css;
  document.head.appendChild(style);
  document.documentElement.classList.add('dark-mode-on');

  // MutationObserver to handle dynamically added images
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Check if it's an element
            const images = node.querySelectorAll('img');
            images.forEach((img) => {
              img.style.filter = 'invert(100%) hue-rotate(180deg)';
            });
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function removeDarkMode() {
  const style = document.getElementById('dark-mode-style');
  if (style) style.remove();
  document.documentElement.classList.remove('dark-mode-on');
}

function getParentDomain(hostname) {
  const parts = hostname.split('.');
  if (parts.length <= 2) return hostname;
  return parts.slice(-2).join('.');
}

// Apply dark mode on page load if site is in enabledSites (check parent domain!)
chrome.storage.sync.get("enabledSites", (data) => {
  const enabledSites = data.enabledSites || {};
  const hostname = window.location.hostname;
  const parentDomain = getParentDomain(hostname);
  if (enabledSites[hostname] || enabledSites[parentDomain]) {
    applyDarkMode();
  }
});

// Listen for toggle messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleDarkMode") {
    if (message.isEnabled) applyDarkMode();
    else removeDarkMode();
    sendResponse({ success: true });
  }
});
