const request = require("request");

module.exports = url => {
  return new Promise(res => {
    request({ uri: url, encoding: null }, function(err, resp, body) {
      if (err || !body) {
        res({ error: true, msg: err });
      } else {
        res({ body });
      }
    });
  });
};
