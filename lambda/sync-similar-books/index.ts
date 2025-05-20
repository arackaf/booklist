import { config } from "dotenv";
import { localSync } from "./sync";

config();

Promise.resolve(localSync()).then(() => {
  console.log("Done");
});
