import "./update-sync";
import parseQueryString from "./query-string";
import searchBooksQuery from "../graphQL/books/getBooks.graphql";
import offlineBookSyncQuery from "../graphQL/books/offlineBookSync.graphql";
import allSubjects from "../graphQL/subjects/allSubjects.graphql";
import allTags from "../graphQL/tags/getTags.graphql";
import allLabelColors from "../graphQL/misc/allLabelColors.graphql";

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

        if (query == allLabelColors) {
          return readTable("labelColors", "order").then(res => {
            return new Response(JSON.stringify({ data: res }), { ok: true, status: 200 });
          });
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
      evt.target.transaction.objectStore("syncInfo").add({ id: 1 });
    }
    if (!db.objectStoreNames.contains("subjects")) {
      let tagStore = db.createObjectStore("subjects", { keyPath: "_id" });
      tagStore.createIndex("name", "name", { unique: false });
    }
    if (!db.objectStoreNames.contains("tags")) {
      let subjectStore = db.createObjectStore("tags", { keyPath: "_id" });
      subjectStore.createIndex("name", "name", { unique: false });
    }
    if (!db.objectStoreNames.contains("labelColors")) {
      let labelColorStore = db.createObjectStore("labelColors", { keyPath: "_id" });
      labelColorStore.createIndex("order", "order", { unique: false });
    }
    evt.target.transaction.oncomplete = fullSync;
  };
}

function readTable(table, idxName) {
  let open = indexedDB.open("books", 1);

  return new Promise(res => {
    open.onsuccess = evt => {
      let db = open.result;
      let tran = db.transaction(table);
      let objStore = tran.objectStore(table);
      let idx = objStore.index(idxName);
      let tranCursor = idx.openCursor();

      let result = [];

      tranCursor.onsuccess = evt => {
        let cursor = evt.target.result;
        if (!cursor) return res(result);

        let item = cursor.value;
        result.push(item);
        cursor.continue();
      };
    };
  });
}

async function syncImages(db, onComplete) {
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
    onComplete();
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
    Promise.all([new Promise(res => doBooksSync(db, res)), doSubjectsSync(db), doTagsSync(db), doLabelColorsSync(db)]).then(() => {
      updateSyncInfo(db, {
        lastLabelColorSync: +new Date(),
        lastTagSync: +new Date(),
        lastSubjectSync: +new Date(),
        lastBookSync: +new Date()
      });
    });
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

function updateSyncInfo(db, updates) {
  let transaction = db.transaction("syncInfo", "readwrite");
  let syncInfoStore = transaction.objectStore("syncInfo");
  let req = syncInfoStore.get(1);
  req.onsuccess = ({ target: { result } }) => {
    Object.assign(result, updates);
    syncInfoStore.put(result);
  };
}

function doBooksSync(db, onFinish, page = 1) {
  let pageSize = 50;
  getGraphqlResults(offlineBookSyncQuery, { page, pageSize }, "allBooks", "Books").then(books => {
    insertItems(db, books, "books", { transformItem: book => Object.assign(book, { imgSync: 0 }) }).then(() => {
      if (books.length == pageSize) {
        doBooksSync(db, onFinish, page + 1);
      } else {
        syncImages(db, onFinish);
      }
    });
  });
}

function doSubjectsSync(db, page = 1) {
  return getGraphqlResults(allSubjects, {}, "allSubjects", "Subjects").then(subjects => insertItems(db, subjects, "subjects"));
}

function doTagsSync(db, page = 1) {
  return getGraphqlResults(allTags, {}, "allTags", "Tags").then(tags => insertItems(db, tags, "tags"));
}

function doLabelColorsSync(db, page = 1) {
  return getGraphqlResults(allLabelColors, {}, "allLabelColors", "LabelColors").then(labelColors => insertItems(db, labelColors, "labelColors"));
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
