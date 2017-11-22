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

self.addEventListener("activate", () => {
  let open = indexedDB.open("books", 1);
  // Set up the database schema
  open.onupgradeneeded = evt => {
    let db = open.result;
    if (!db.objectStoreNames.contains("books")) {
      db.createObjectStore("books", { keyPath: "_id" });
      evt.target.transaction.oncomplete = () => syncBooks(db);
    }
  };
});

const doFetch = (url, data) =>
  fetch(url, {
    method: "post",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

async function syncBooks(db, page = 1) {
  let pageSize = 50;
  doFetch("/book/offlineSync", { page, pageSize })
    .then(resp => resp.json())
    .then(resp => {
      if (!resp.books) return;
      let books = resp.books;
      let count = books.count;

      let transaction = db.transaction("books", "readwrite");
      let booksStore = transaction.objectStore("books");
      let i = 0;
      putNext();

      function putNext() {
        if (i < books.length) {
          let book = books[i++];
          booksStore.put(book).onsuccess = putNext;
        } else {
          if (books.count == pageSize) {
            syncBooks(page + 1);
          }
        }
      }
    });
}
