/// <reference lib="dom" />
window.addEventListener("message", (event) => {
  chrome.search.query({ text: event.data?.search?.query });
});
