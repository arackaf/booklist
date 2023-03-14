import { doSyncAuthor } from "./index.js";

(async function () {
  for (;;) {
    await doSyncAuthor();
    break;
  }
})();
