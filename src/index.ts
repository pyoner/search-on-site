const search = async (text: string) => {
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
    text: `site:${url.hostname} ${text}`,
    disposition: "CURRENT_TAB",
  });
};

// init
chrome.omnibox.setDefaultSuggestion({ description: "Search On Site" });
chrome.omnibox.onInputEntered.addListener(search);

// Create a context menu item
chrome.contextMenus.create({
  id: "son",
  title: "Search On Site",
  contexts: ["all"],
});

// Add a click event listener
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "son" && info.selectionText) {
    // Perform your action here
    search(info.selectionText);
  }
});
