import { search } from "./helpers";

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

chrome.action.onClicked.addListener(async () => {
  // Get the screen's width and height
  let screenWidth = 1920; //window.screen.availWidth;
  let screenHeight = 1080; //window.screen.availHeight;

  // Calculate the size of the popup window
  let popupWidth = screenWidth / 3;
  let popupHeight = screenHeight / 3;

  // Calculate the position of the popup window to be centered
  let left = (screenWidth - popupWidth) / 2;
  let top = (screenHeight - popupHeight) / 2;

  // Create the popup window
  await chrome.windows.create({
    url: "popup.html",
    type: "popup",
    left: Math.round(left),
    top: Math.round(top),
    width: Math.round(popupWidth),
    height: Math.round(popupHeight),
  });
});
