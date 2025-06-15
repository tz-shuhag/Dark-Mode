chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleDarkMode") {
    const hostname = message.hostname;
    const tabId = sender.tab ? sender.tab.id : message.tabId; // Handle both content script and popup origins

    chrome.storage.sync.get("enabledSites", (data) => {
      const enabledSites = data.enabledSites || {};
      const isEnabled = !enabledSites[hostname];
      enabledSites[hostname] = isEnabled;

      // Update storage
      chrome.storage.sync.set({ enabledSites }, () => {
        // Send message to content script to apply/remove dark mode immediately
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