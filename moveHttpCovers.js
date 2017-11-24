require("dotenv").config({ path: "./node-src/maintenance/.env" });
require = require("@std/esm")(module, { esm: "js", cjs: true });
require("./node-src/maintenance/moveHttpCovers");
