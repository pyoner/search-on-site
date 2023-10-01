chrome.runtime.onInstalled.addListener(() => {
  chrome.omnibox.setDefaultSuggestion({ description: "Search On Site" });
  chrome.omnibox.onInputEntered.addListener(async (text) => {
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
  });
});
