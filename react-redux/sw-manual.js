toolbox.router.get(/books$/, handleMain);
toolbox.router.get(/subjects$/, handleMain);
toolbox.router.get(/localhost:3000\/$/, handleMain);
toolbox.router.get(/mylibrary.io$/, handleMain);

function handleMain(request) {
  return fetch(request).catch(() => {
    return caches.match("react-redux/offline.htm", { ignoreSearch: true });
    return new Response("Hello World");
    return fetch("react-redux/offline.htm", { headers: { "content-type": "text/html" } });
  });
}

self.addEventListener("push", () => {
  console.log("typeof", typeof toolbox);
  console.log("Push notification received!!!");
  self.registration.showNotification("Push notification received!");
});
