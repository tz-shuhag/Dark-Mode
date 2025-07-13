function getParentDomain(hostname) {
  // Handles most cases, e.g., ab.example.com => example.com
  const parts = hostname.split('.');
  if (parts.length <= 2) return hostname;
  return parts.slice(-2).join('.');
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleDarkMode") {
    const hostname = message.hostname;
    const parentDomain = getParentDomain(hostname);
    const tabId = sender.tab ? sender.tab.id : message.tabId;

    chrome.storage.sync.get("enabledSites", (data) => {
      const enabledSites = data.enabledSites || {};
      // Toggle parent domain dark mode
      const isEnabled = !enabledSites[parentDomain];
      enabledSites[parentDomain] = isEnabled;

      chrome.storage.sync.set({ enabledSites }, () => {
        chrome.tabs.sendMessage(tabId, {
          action: "toggleDarkMode",
          isEnabled: isEnabled
        }, (response) => {
          sendResponse({ isEnabled });
        });
      });
    });
    return true; // Keep the message channel open for async response
  }
});
