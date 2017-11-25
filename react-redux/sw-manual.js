toolbox.router.get(/books$/, handleMain);
toolbox.router.get(/subjects$/, handleMain);
toolbox.router.get(/localhost:3000\/$/, handleMain);
toolbox.router.get(/mylibrary.io$/, handleMain);

function handleMain(request) {
  return fetch(request).catch(() => {
    return caches.match("react-redux/offline.htm", { ignoreSearch: true });
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
    if (!db.objectStoreNames.contains("books") || !db.objectStoreNames.contains("syncInfo")) {
      if (!db.objectStoreNames.contains("books")) {
        db.createObjectStore("books", { keyPath: "_id" });
      }
      if (!db.objectStoreNames.contains("syncInfo")) {
        db.createObjectStore("syncInfo", { keyPath: "id" });
        evt.target.transaction.objectStore("syncInfo").add({ id: 1, lastSync: null });
      }
      evt.target.transaction.oncomplete = fullSync;
    }
  };
});

self.addEventListener("message", evt => {
  console.log("MESSAGE", evt.data);
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

function fullSync(page = 1) {
  let open = indexedDB.open("books", 1);

  // Set up the database schema
  open.onsuccess = evt => {
    let db = open.result;
    fullSyncPage(db, 1);
  };
}

function fullSyncPage(db, page) {
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
        if (i < pageSize) {
          let book = books[i++];
          if (!book) {
            return;
          }

          booksStore.add(book).onsuccess = putNext;
          preCacheBookImage(book);
        } else {
          if (books.length > pageSize) {
            fullSyncPage(db, page + 1);
          }
        }
      }
    });
}

async function preCacheBookImage(book) {
  let smallImage = book.smallImage;
  if (!smallImage) return;
  if (/https:\/\/s3.amazonaws.com\/my-library-cover-uploads/.test(smallImage)) {
    let cache = await caches.open("local-images1");
    let img = await fetch(smallImage, { mode: "no-cors" });
    await cache.put(smallImage, img);
  }
}
