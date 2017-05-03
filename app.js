var cp = require("child_process");

cp.exec('node app.js', {cwd: './node-dest'});