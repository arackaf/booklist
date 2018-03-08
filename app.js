require = require("@std/esm")(module, { mode: "js", cjs: true });
require("./node-dest/app-helpers/promiseUtils");
require("dotenv").config();
require("./startApp");
