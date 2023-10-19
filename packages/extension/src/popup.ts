/// <reference lib="dom" />
import { search } from "./helpers";

window.addEventListener("message", (event) => {
  search(event.data?.search?.query);
});
