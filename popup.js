document.getElementById("toggleButton").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const hostname = new URL(tab.url).hostname;
  
      chrome.runtime.sendMessage(
        { action: "toggleDarkMode", hostname: hostname, tabId: tab.id },
        (response) => {
          if (response && response.isEnabled !== undefined) {
            console.log(`Dark mode ${response.isEnabled ? "enabled" : "disabled"} for ${hostname}`);
          }
        }
      );
    });
  });