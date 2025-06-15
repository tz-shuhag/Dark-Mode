function applyDarkMode() {
  // Use a class to toggle dark mode, which is cleaner than direct style manipulation.
  const css = `
    html.dark-mode-on {
      filter: invert(100%) hue-rotate(180deg);
      /* Setting a background prevents a white flash on load */
      background-color: #fcfcfc;
    }

    /* Select all media and other elements that should NOT be inverted.
      This list is more comprehensive than the original.
    */
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

  // Finally, add the class to the html element to activate the styles.
  document.documentElement.classList.add('dark-mode-on');
}

function removeDarkMode() {
  const style = document.getElementById('dark-mode-style');
  if (style) {
    style.remove();
  }
  document.documentElement.classList.remove('dark-mode-on');
}

// Apply dark mode on page load if site is in enabledSites
chrome.storage.sync.get("enabledSites", (data) => {
  const enabledSites = data.enabledSites || {};
  const hostname = window.location.hostname;
  if (enabledSites[hostname]) {
    applyDarkMode();
  }
});

// Listen for toggle messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleDarkMode") {
    if (message.isEnabled) {
      applyDarkMode();
    } else {
      removeDarkMode();
    }
    sendResponse({ success: true });
  }
});
