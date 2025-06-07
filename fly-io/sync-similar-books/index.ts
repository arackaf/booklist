import "./util/config";
import { localSync } from "./sync";

Promise.resolve(localSync()).then(() => {
  console.log("Done");
});
