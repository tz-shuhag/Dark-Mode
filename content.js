function applyDarkMode() {
  const css = `
    html.dark-mode-on, body.dark-mode-on {
      color: #c0c0c0;
      background-color: #2e2e2e;
      color-scheme: dark;
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

// Apply dark mode on page load if site is in enabledSites
chrome.storage.sync.get("enabledSites", (data) => {
  const enabledSites = data.enabledSites || {};
  const hostname = window.location.hostname;
  const parentDomain = getParentDomain(hostname);
  if (enabledSites[hostname] || enabledSites[parentDomain]) {
    applyDarkMode();
  }
});

// Listen for toggle messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleDarkMode") {
    if (message.isEnabled) applyDarkMode();
    else removeDarkMode();
    sendResponse({ success: true });
  }
});
