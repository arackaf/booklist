self.addEventListener("message", event => {
  if (event.data == "sw-update-accepted") {
    console.log("RECEIVED MESSAGE THAT I ACCEPTED THE UPDATE");
    self.skipWaiting().then(() => {
      self.clients.claim().then(() => {
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.postMessage("sw-updated"));
        });
      });
    });
  }
});
