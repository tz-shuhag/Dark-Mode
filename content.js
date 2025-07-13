function applyDarkMode() {
  const css = `
    html.dark-mode-on {
      filter: invert(100%) hue-rotate(180deg);
      background-color: #fcfcfc;
    }
    html.dark-mode-on img,
    html.dark-mode-on video,
    html.dark-mode-on picture,
    html.dark-mode-on iframe,
    html.dark-mode-on svg,
    html.dark-mode-on [style*="background-image"] {
      filter: invert(100%) hue-rotate(180deg);
    }
  `;
  const style = document.createElement('style');
  style.id = 'dark-mode-style';
  style.textContent = css;
  document.head.appendChild(style);
  document.documentElement.classList.add('dark-mode-on');
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
