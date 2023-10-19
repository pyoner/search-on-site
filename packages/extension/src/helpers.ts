export const search = async (
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
