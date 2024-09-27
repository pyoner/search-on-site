import { getRankedBangs } from "bangs";
import { getActiveTabURL, search } from "./helpers";
import xmlEscape from "xml-escape";
import Fuse from "fuse.js";

const CONTEXT_MENU_ID = "son";

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

const fuse = new Fuse(getRankedBangs(), { keys: ["t", "s", "sc", "c"] });
chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  console.log(text);
  const results = fuse.search(text, { limit: 10 });
  console.log(results);

  const suggestions: chrome.omnibox.SuggestResult[] = results.map((result) => {
    const bang = result.item;
    return {
      content: `${bang.t}`,
      description: xmlEscape(`${bang.s} - ${bang.sc} / ${bang.c}`),
    };
  });

  console.log(suggestions);
  suggest(suggestions);
});

chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
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

  // Get the screen's width and height
  let screenWidth = 1920; //window.screen.availWidth;
  let screenHeight = 1080; //window.screen.availHeight;

  // Calculate the size of the popup window
  const c = 2;
  let popupWidth = screenWidth / c;
  let popupHeight = screenHeight / c;

  // Calculate the position of the popup window to be centered
  let left = (screenWidth - popupWidth) / 2;
  let top = (screenHeight - popupHeight) / 2;

  // Create the popup window
  await chrome.windows.create({
    url: `popup.html?site=${url?.hostname}`,
    type: "popup",
    left: Math.round(left),
    top: Math.round(top),
    width: Math.round(popupWidth),
    height: Math.round(popupHeight),
  });
});
