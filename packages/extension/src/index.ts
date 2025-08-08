import Fuse from "fuse.js";
import xmlEscape from "xml-escape";

import bangs from "bangs-duckgo/bangs.json";
import { rankedBangs, parseBang, bangURL } from "bangs-duckgo";
import { getActiveTabURL, search } from "./helpers";

const CONTEXT_MENU_ID = "son";
const DEV_ID = "ahomneldfbbdccjfeibjabldgnnfinam";
const DEV_URL = "http://localhost:5173/";
const SON_URL =
  chrome.runtime.id === DEV_ID ? DEV_URL : "https://www.searchon.site/";

const fuse = new Fuse(rankedBangs(bangs), {
  keys: ["bang", "siteName", "subcategoty", "category"],
});

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

chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  const results = fuse.search(text, { limit: 10 });

  const suggestions: chrome.omnibox.SuggestResult[] = results.map((result) => {
    const bang = result.item;
    return {
      content: `!${bang.bang}`,
      description: xmlEscape(
        `${bang.name} - ${bang.subcategory} / ${bang.category}`,
      ),
    };
  });

  suggest(suggestions);
});

chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
  const r = parseBang(text);
  if (r) {
    const item = bangs.find((b) => b.bang === r.bang);
    if (item) {
      const url = bangURL(item, r.query);
      await chrome.tabs.update({ url });
    }
    return;
  }

  const url = await getActiveTabURL();
  if (!url) {
    return;
  }

  search(
    text,
    { site: url.hostname },
    disposition == "currentTab" ? "CURRENT_TAB" : "NEW_TAB",
  );
});

// Add a click event listener
chrome.contextMenus.onClicked.addListener(async function (info, tab) {
  const url = await getActiveTabURL();
  if (!url) {
    return;
  }

  if (info.menuItemId === CONTEXT_MENU_ID && info.selectionText) {
    // Perform your action here
    await search(info.selectionText, { site: url.hostname }, "NEW_TAB");
  }
});

chrome.action.onClicked.addListener(async () => {
  const url = await getActiveTabURL();
  if (!url) {
    return;
  }

  await chrome.tabs.create({
    url: `${SON_URL}?site=${url?.hostname}`,
  });
});

chrome.runtime.onMessageExternal.addListener((request, sender) => {
  if (request.type === "search" && request.query) {
    search(request.query, { site: request.site });
  }
});
