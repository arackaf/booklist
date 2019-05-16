require = require("esm")(module, { mode: "auto", cjs: true });
require("./node/app-helpers/promiseUtils");
require("dotenv").config();
require("./startApp-public");
