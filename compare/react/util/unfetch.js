!(function(e, n) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = n())
    : "function" == typeof define && define.amd ? define(n) : (e.unfetch = n());
})(this, function() {
  return "function" == typeof fetch
    ? fetch
    : function(e, n) {
        return (
          (n = n || {}),
          new Promise(function(t, o) {
            function r() {
              var e,
                n = [],
                t = [],
                o = {};
              return (
                s.getAllResponseHeaders().replace(/^(.*?):\s*([\s\S]*?)$/gm, function(r, s, u) {
                  n.push((s = s.toLowerCase())), t.push([s, u]), (e = o[s]), (o[s] = e ? e + "," + u : u);
                }),
                {
                  ok: 1 == ((s.status / 200) | 0),
                  status: s.status,
                  statusText: s.statusText,
                  url: s.responseURL,
                  clone: r,
                  text: function() {
                    return Promise.resolve(s.responseText);
                  },
                  json: function() {
                    return Promise.resolve(s.responseText).then(JSON.parse);
                  },
                  xml: function() {
                    return Promise.resolve(s.responseXML);
                  },
                  blob: function() {
                    return Promise.resolve(new Blob([s.response]));
                  },
                  headers: {
                    keys: function() {
                      return n;
                    },
                    entries: function() {
                      return t;
                    },
                    get: function(e) {
                      return o[e.toLowerCase()];
                    },
                    has: function(e) {
                      return e.toLowerCase() in o;
                    }
                  }
                }
              );
            }
            var s = new XMLHttpRequest();
            s.open(n.method || "get", e);
            for (var u in n.headers) s.setRequestHeader(u, n.headers[u]);
            (s.withCredentials = "include" == n.credentials),
              (s.onload = function() {
                t(r());
              }),
              (s.onerror = o),
              s.send(n.body);
          })
        );
      };
});
//# sourceMappingURL=unfetch.umd.js.map
