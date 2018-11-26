"use strict";

function parserForArrayFormat(opts) {
  var result;

  switch (opts.arrayFormat) {
    case "index":
      return function(key, value, accumulator) {
        result = /\[(\d*)\]$/.exec(key);

        key = key.replace(/\[\d*\]$/, "");

        if (!result) {
          accumulator[key] = value;
          return;
        }

        if (accumulator[key] === undefined) {
          accumulator[key] = {};
        }

        accumulator[key][result[1]] = value;
      };

    case "bracket":
      return function(key, value, accumulator) {
        result = /(\[\])$/.exec(key);

        key = key.replace(/\[\]$/, "");

        if (!result || accumulator[key] === undefined) {
          accumulator[key] = value;
          return;
        }

        accumulator[key] = [].concat(accumulator[key], value);
      };

    default:
      return function(key, value, accumulator) {
        if (accumulator[key] === undefined) {
          accumulator[key] = value;
          return;
        }

        accumulator[key] = [].concat(accumulator[key], value);
      };
  }
}

function encode(value, opts) {
  if (opts.encode) {
    return encodeURIComponent(value);
  }

  return value;
}

function keysSorter(input) {
  if (Array.isArray(input)) {
    return input.sort();
  } else if (typeof input === "object") {
    return keysSorter(Object.keys(input))
      .sort(function(a, b) {
        return Number(a) - Number(b);
      })
      .map(function(key) {
        return input[key];
      });
  }

  return input;
}

self.parseQueryString = function(str, opts) {
  opts = Object.assign({ arrayFormat: "none" }, opts);

  var formatter = parserForArrayFormat(opts);

  // Create an object with no prototype
  // https://github.com/sindresorhus/query-string/issues/47
  var ret = Object.create(null);

  if (typeof str !== "string") {
    return ret;
  }

  str = str.trim().replace(/^(\?|#|&)/, "");

  if (!str) {
    return ret;
  }

  str.split("&").forEach(function(param) {
    var parts = param.replace(/\+/g, " ").split("=");
    // Firefox (pre 40) decodes `%3D` to `=`
    // https://github.com/sindresorhus/query-string/pull/37
    var key = parts.shift();
    var val = parts.length > 0 ? parts.join("=") : undefined;

    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    val = val === undefined ? null : decodeURIComponent(val);

    formatter(decodeURIComponent(key), val, ret);
  });

  return Object.keys(ret)
    .sort()
    .reduce(function(result, key) {
      var val = ret[key];
      if (Boolean(val) && typeof val === "object" && !Array.isArray(val)) {
        // Sort object keys, not values
        result[key] = keysSorter(val);
      } else {
        result[key] = val;
      }

      return result;
    }, Object.create(null));
};
