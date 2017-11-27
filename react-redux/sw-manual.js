toolbox.router.get(/books$/, handleMain);
toolbox.router.get(/subjects$/, handleMain);
toolbox.router.get(/localhost:3000\/$/, handleMain);
toolbox.router.get(/mylibrary.io$/, handleMain);

toolbox.router.post(/graphql/, request => {
  return fetch(request).then(response => {
    let respClone = response.clone();
    setTimeout(() => {
      respClone.json().then(resp => {
        if (resp && resp.data && resp.data.updateBook && resp.data.updateBook.Book) {
          syncBook(resp.data.updateBook.Book);
        }
      }, 5);
    });
    return response;
  });
});

function syncBook(book) {
  let open = indexedDB.open("books", 1);

  open.onsuccess = evt => {
    let db = open.result;
    if (db.objectStoreNames.contains("books")) {
      let tran = db.transaction("books", "readwrite");
      let booksStore = tran.objectStore("books");
      booksStore.get(book._id).onsuccess = ({ target: { result: bookToUpdate } }) => {
        ["title", "authors", "isbn"].forEach(prop => (bookToUpdate[prop] = book[prop]));
        booksStore.put(bookToUpdate);
      };
    }
  };
}

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

  open.onupgradeneeded = evt => {
    let db = open.result;
    if (!db.objectStoreNames.contains("books") || !db.objectStoreNames.contains("syncInfo")) {
      if (!db.objectStoreNames.contains("books")) {
        let bookStore = db.createObjectStore("books", { keyPath: "_id" });
        bookStore.createIndex("imgSync", "imgSync", { unique: false });
      }
      if (!db.objectStoreNames.contains("syncInfo")) {
        db.createObjectStore("syncInfo", { keyPath: "id" });
        evt.target.transaction
          .objectStore("syncInfo")
          .add({ id: 1, lastImgSync: null, lastImgSyncStarted: null, lastLoadStarted: +new Date(), lastLoad: null });
      }
      evt.target.transaction.oncomplete = fullSync;
    }
  };
});

self.addEventListener("message", evt => {
  if (evt.data && evt.data.command == "sync-images") {
    let open = indexedDB.open("books", 1);

    open.onsuccess = evt => {
      let db = open.result;
      if (db.objectStoreNames.contains("books")) {
        syncImages(db);
      }
    };
  }
});

function syncImages(db) {
  let tran = db.transaction("books");
  let booksStore = tran.objectStore("books");
  let idx = booksStore.index("imgSync");
  let booksCursor = idx.openCursor(0);
  let booksToUpdate = [];

  booksCursor.onsuccess = evt => {
    let cursor = evt.target.result;
    if (!cursor) return runIt();

    let book = cursor.value;
    booksToUpdate.push({ _id: book._id, smallImage: book.smallImage });
    cursor.continue();
  };

  async function runIt() {
    if (!booksToUpdate.length) return;

    for (let _book of booksToUpdate) {
      try {
        let imgCached = await preCacheBookImage(_book);
        if (imgCached) {
          let tran = db.transaction("books", "readwrite");
          let booksStore = tran.objectStore("books");
          await new Promise(res => {
            let req = booksStore.get(_book._id);
            req.onsuccess = ({ target: { result: bookToUpdate } }) => {
              bookToUpdate.imgSync = 1;
              booksStore.put(bookToUpdate);
              res();
            };
            req.onerror = () => res();
          });
        }
      } catch (er) {
        console.log("ERROR", er);
      } finally {
      }
    }
  }
}

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
      let i = 0;
      putNext();

      function putNext() {
        if (i < pageSize) {
          let book = books[i++];
          if (!book) {
            loadDone(db);
            return;
          }

          let transaction = db.transaction("books", "readwrite");
          let booksStore = transaction.objectStore("books");
          booksStore.add(Object.assign(book, { imgSync: 0 })).onsuccess = putNext;
        } else {
          if (books.length > pageSize) {
            fullSyncPage(db, page + 1);
          } else {
            loadDone(db);
          }
        }
      }
    });
}

function loadDone(db) {
  let transaction = db.transaction("syncInfo", "readwrite");
  let syncInfoStore = transaction.objectStore("syncInfo");
  let req = syncInfoStore.get(1);
  req.onsuccess = ({ target: { result } }) => {
    Object.assign(result, { lastLoad: +new Date(), lastLoadStarted: null });
    syncInfoStore.put(result);
  };
}

async function preCacheBookImage(book) {
  let smallImage = book.smallImage;
  if (!smallImage) return;

  let cachedImage = await caches.match(smallImage);
  if (cachedImage) return;

  if (/https:\/\/s3.amazonaws.com\/my-library-cover-uploads/.test(smallImage)) {
    let cache = await caches.open("local-images1");
    let img = await fetch(smallImage, { mode: "no-cors" });
    await cache.put(smallImage, img);
    return true;
  }
}
