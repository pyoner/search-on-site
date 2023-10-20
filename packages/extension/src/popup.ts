/// <reference lib="dom" />
import { search } from "./helpers";

window.addEventListener("message", async (event) => {
  const site = new URL(document.URL).searchParams.get("site");
  if (!site) {
    return;
  }

  await search(event.data?.search?.query, { site }, "NEW_TAB");
  window.close();
});
