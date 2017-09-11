require = require("@std/esm")(module, { esm: "js", cjs: true });
require("./node-dest/app-helpers/promiseUtils");
require("dotenv").config();
require("./startApp");
