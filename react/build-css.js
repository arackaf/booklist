var purify = require("purify-css");

var content = ["./dist/**/*.js"]; //webpack-built content

var minify = true;

console.log("\ncreating css builds...");

purify(content, ["./styles/fontawesome/css/all.css"], {
  minify: minify,
  output: "./styles/fontawesome/css/font-awesome-booklist-build.css"
});

console.log("css builds complete");
