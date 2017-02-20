var purify = require('purify-css');

var content = ['./dist/**/*.js']; //webpack-built content
var css = ['./static/bootstrap/css/bootstrap.css', './fontawesome/css/font-awesome.css'];

var options = {
  // Will write purified CSS to this file.
  output: './dist-css/purified.css',
  minify: true
};

purify(content, css, options);


