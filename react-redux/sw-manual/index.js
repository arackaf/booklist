import "./update-sync";
import parseQueryString from "./query-string";
import searchBooksQuery from "../graphQL/books/getBooks.graphql";
import offlineBookSyncQuery from "../graphQL/books/offlineBookSync.graphql";

workbox.routing.registerRoute(
  /graphql$/,
  ({ url, event }) => {
    //turning this off for now, until I can wrap some other things up
    return fetch(event.request);

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
  },
  "POST"
);

workbox.routing.registerRoute(
  /graphql/,
  ({ url, event }) => {
    event.respondWith(
      fetch(event.request).catch(err => {
        const { query, variables } = parseQueryString(url.search);

        if (query == searchBooksQuery) {
          return searchBooks(variables, res => event.respondWith(res));
        }
      })
    );
  },
  "GET"
);

function searchBooks(variables, cb) {
  return new Response(
    JSON.stringify({
      data: {}
    }),
    { ok: true, status: 200 }
  );
}

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

self.addEventListener("push", () => {
  console.log("Push notification received!!!");
  self.registration.showNotification("Push notification received!");
});

self.addEventListener("message", evt => {
  if (evt.data && evt.data.command == "do-sync") {
    masterSync();
  }
});

self.addEventListener("activate", masterSync);

function masterSync() {
  let open = indexedDB.open("books", 1);

  open.onupgradeneeded = evt => {
    console.log("Setting up DB");
    let db = open.result;
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
  };
}

function syncImages(db) {
  console.log("SYNCING IMAGES");
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

const doFetch = url =>
  fetch(url, {
    method: "get",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

function fullSync(page = 1) {
  let open = indexedDB.open("books", 1);

  // Set up the database schema
  open.onsuccess = evt => {
    let db = open.result;
    fullSyncPage(db, 1);
  };
}

function getGraphqlResults(query, variables, op, name) {
  return doFetch(`/graphql/?query=${query}&variables=${JSON.stringify(variables)}`)
    .then(resp => resp.json())
    .then(resp => {
      return resp.data && resp.data[op] && resp.data[op][name];
    });
}

function insertItems(db, items, storeName, { transformItem = x => x } = {}) {
  return new Promise(res => {
    if (!items) return res();
    let i = 0;
    putNext();

    function putNext() {
      let item = items[i++];
      if (!item) {
        return res();
      }

      let transaction = db.transaction(storeName, "readwrite");
      let store = transaction.objectStore(storeName);
      store.add(transformItem(item)).onsuccess = putNext;
    }
  });
}

function fullSyncPage(db, page) {
  let pageSize = 50;
  getGraphqlResults(offlineBookSyncQuery, { page, pageSize }, "allBooks", "Books").then(books => {
    insertItems(db, books, "books", { transformItem: book => Object.assign(book, { imgSync: 0 }) }).then(() => {
      if (books.length == pageSize) {
        fullSyncPage(db, page + 1);
      } else {
        loadDone(db);
      }
    });
  });

  async function loadDone(db) {
    await syncImages(db);
    let transaction = db.transaction("syncInfo", "readwrite");
    let syncInfoStore = transaction.objectStore("syncInfo");
    let req = syncInfoStore.get(1);
    req.onsuccess = ({ target: { result } }) => {
      Object.assign(result, { lastLoad: +new Date(), lastLoadStarted: null });
      syncInfoStore.put(result);
    };
  }
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

  if (/https:\/\/images-na\.ssl-images-amazon\.com/.test(smallImage)) {
    let cache = await caches.open("amazon-images1");
    let img = await fetch(smallImage, { mode: "no-cors" });
    await cache.put(smallImage, img);
    return true;
  }

  if (/https:\/\/ecx\.images-amazon\.com/.test(smallImage)) {
    let cache = await caches.open("amazon-images1");
    let img = await fetch(smallImage, { mode: "no-cors" });
    await cache.put(smallImage, img);
    return true;
  }
}
