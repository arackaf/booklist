const invert = require("lodash.invert");

const fs = require("fs");
const queries = fs.readFileSync("./extracted_queries.json", { encoding: "utf8" });

fs.writeFileSync("./sw-manual/extracted-queries.js", "export default " + JSON.stringify(invert(eval("(" + queries + ")"))));
