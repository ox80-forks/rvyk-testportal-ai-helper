console.log("[TestPortal Helper] Background script loaded");

chrome.runtime.onInstalled.addListener(() => {
  console.log("[TestPortal Helper] Extension installed");

  chrome.contextMenus.create({
    id: "testportal-helper-config",
    title: "TestPortal Helper Configuration",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "testportal-helper-config") {
    chrome.tabs.sendMessage(tab.id, { action: "openConfig" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(
          "[TestPortal Helper] Error sending message:",
          chrome.runtime.lastError
        );
      } else {
        console.log("[TestPortal Helper] Config window opened:", response);
      }
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[TestPortal Helper] Message received:", message);
  return true;
});
