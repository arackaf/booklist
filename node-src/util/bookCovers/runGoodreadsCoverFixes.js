require = require("esm")(module, { mode: "auto", cjs: true });
require("dotenv").config({ path: "./.env" });
require("./goodreadsCovers");
