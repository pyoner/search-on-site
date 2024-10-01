/// <reference lib="dom" />
import { search } from "./helpers";

const DEV_ID = "kdfeccgoggdgloiblniaimnabknamnca";
const DEV_URL = "http://localhost:5173/";

if (chrome.runtime.id === DEV_ID) {
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("son")?.setAttribute("src", DEV_URL);
  });
}

window.addEventListener("message", async (event) => {
  const site = new URL(document.URL).searchParams.get("site");
  if (!site) {
    return;
  }

  await search(event.data?.search?.query, { site }, "NEW_TAB");
  window.close();
});

// close inactive window
let timer: number;
chrome.windows.onFocusChanged.addListener(async () => {
  const currWindow = await chrome.windows.getCurrent();
  if (currWindow.focused) {
    window.clearTimeout(timer);
  } else {
    timer = window.setTimeout(() => {
      window.close();
    }, 5000);
  }
});
