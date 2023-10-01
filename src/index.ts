chrome.runtime.onInstalled.addListener(() => {
  chrome.omnibox.setDefaultSuggestion({ description: "Search On Site" });
  chrome.omnibox.onInputEntered.addListener(async (text) => {
    await chrome.search.query({ text, disposition: "CURRENT_TAB" });
  });
});
