export type SEOperators = {
  site: string;
};

export const joinSEOperators = (operators: SEOperators) =>
  Object.entries(operators).reduce(
    (acc, [k, v]) => (v ? `${acc} ${k}:${v}`.trim() : acc),
    ""
  );

export const search = async (
  text: string,
  operators: SEOperators,
  disposition: chrome.search.Disposition = "CURRENT_TAB"
) => {
  const prefix = joinSEOperators(operators);
  if (!prefix) {
    return;
  }

  await chrome.search.query({
    text: `${prefix} ${text.trim()}`,
    disposition,
  });
};

export const getActiveTabURL = async () => {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const tab = tabs[0];
  if (!tab?.url) {
    return;
  }

  return new URL(tab.url);
};
