/// <reference lib="dom" />
import { search } from "./helpers";

window.addEventListener("message", async (event) => {
  await search(event.data?.search?.query);
  //window.close();
});
