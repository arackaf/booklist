self.addEventListener("message", event => {
  if (event.data == "sw-update-accepted") {
    self.skipWaiting().then(() => {
      self.clients.claim().then(() => {
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.postMessage("sw-updated"));
        });
      });
    });
  }
});
