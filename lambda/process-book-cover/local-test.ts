import "./util/config";

import { processCover } from "./util/processCover";

async function main() {
  const url = "https://m.media-amazon.com/images/I/61oQoR3lkIL._AC_SF480,480_.jpg";
  const userId = "test-user";

  const result = await processCover(url, userId);

  console.log(result);
}

main();
