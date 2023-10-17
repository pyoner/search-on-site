const CONTEXT_MENU_ID = "son";
const search = async (
  text: string,
  disposition: chrome.search.Disposition = "CURRENT_TAB"
) => {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const tab = tabs[0];
  if (!tab) {
    return;
  }

  if (!tab.url) {
    return;
  }

  const url = new URL(tab.url);

  await chrome.search.query({
    text: `site:${url.hostname} ${text.trim()}`,
    disposition,
  });
};

// Add a listener to create the initial context menu items,
// context menu items only need to be created at runtime.onInstalled
chrome.runtime.onInstalled.addListener(async () => {
  // Create a context menu item
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "Search On Site",
    contexts: ["all"],
  });
});

chrome.omnibox.setDefaultSuggestion({ description: "Search On Site" });
chrome.omnibox.onInputEntered.addListener((text, disposition) =>
  search(text, disposition == "currentTab" ? "CURRENT_TAB" : "NEW_TAB")
);

// Add a click event listener
chrome.contextMenus.onClicked.addListener(async function (info, tab) {
  if (info.menuItemId === CONTEXT_MENU_ID && info.selectionText) {
    // Perform your action here
    await search(info.selectionText, "NEW_TAB");
  }
});
