function applyDarkMode() {
  const css = `
    html {
      /* Apply the primary inversion to the entire page */
      filter: invert(100%) hue-rotate(180deg) !important;
      /* Setting a background prevents a white flash on load and helps with transparency issues */
      background-color: #fcfcfc !important;
    }

    /* Force all text to be a light color after inversion */
    body, p, a, h1, h2, h3, h4, h5, h6, span, li, td, th, div {
        color: #ddd !important;
    }

    /* Re-invert elements that should retain their original colors */
    /* This list is designed to be comprehensive for common media and UI elements */
    img, video, picture, canvas, svg,
    [style*="background-image" i], /* Case-insensitive match for background-image in inline styles */
    [class*="icon"], /* Elements with "icon" in their class name */
    [id*="icon"],   /* Elements with "icon" in their ID */
    button,
    input,
    textarea,
    select,
    [role="button"],
    [role="img"],
    [role="presentation"],
    a, /* Links might need re-inversion if their default colors are problematic */
    iframe,
    embed,
    object,
    /* Re-invert for shadows and other visual effects */
    *, *::before, *::after {
        -webkit-filter: invert(100%) hue-rotate(180deg) !important;
        filter: invert(100%) hue-rotate(180deg) !important;
    }

    /* Additional fixes for specific common issues */
    .btn, .button, .ui-button, .card {
      filter: invert(100%) hue-rotate(180deg) !important;
    }
  `;

  // Create or update the style element
  let style = document.getElementById('dark-mode-style');
  if (!style) {
    style = document.createElement('style');
    style.id = 'dark-mode-style';
    document.head.appendChild(style);
  }
  style.textContent = css;

  // Add a class to the html element to indicate dark mode is active
  document.documentElement.classList.add('dark-mode-active');
}

function removeDarkMode() {
  const style = document.getElementById('dark-mode-style');
  if (style) {
    style.remove();
  }
  // Remove the class from the html element
  document.documentElement.classList.remove('dark-mode-active');
}

// Apply dark mode on page load if the current site is in enabledSites
chrome.storage.sync.get("enabledSites", (data) => {
  const enabledSites = data.enabledSites || {};
  const hostname = window.location.hostname;
  if (enabledSites[hostname]) {
    applyDarkMode();
  }
});

// Listen for messages from the background script (e.g., from the popup)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleDarkMode") {
    if (message.isEnabled) {
      applyDarkMode();
    } else {
      removeDarkMode();
    }
    // Send a response back to the sender (e.g., popup script)
    sendResponse({ success: true });
  }
});
