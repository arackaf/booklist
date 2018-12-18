import "./update-sync";
import escapeRegex from "./escape-regex";
import parseQueryString from "./query-string";
import offlineBookSyncQuery from "../graphQL/books/offlineBookSync.graphql";

import searchBooksQuery from "../graphQL/books/getBooks.graphql";
import allSubjects from "../graphQL/subjects/allSubjects.graphql";
import allTags from "../graphQL/tags/getTags.graphql";
import allLabelColors from "../graphQL/misc/allLabelColors.graphql";

import offlineUpdateSync from "../graphQL/misc/offlineUpdateSync.graphql";

const bookSyncTransform = book => Object.assign(book, { title_ci: (book.title || "").toLowerCase() });

workbox.routing.registerRoute(
  /graphql$/,
  ({ url, event }) => {
    return fetch(event.request).then(response => {
      let respClone = response.clone();
      setTimeout(() => {
        respClone.json().then(resp => {
          syncResultsFor(resp, "Book", bookSyncTransform);
          syncResultsFor(resp, "Tag");
          syncSubjectsResults(resp);
        }, 5);
      });
      return response;
    });
  },
  "POST"
);

function syncResultsFor(resp, name, transform = item => item) {
  let updateName = `update${name}`;
  if (resp && resp.data && resp.data[updateName] && resp.data[updateName][name]) {
    syncItem(transform(resp.data[updateName][name]), `${name.toLowerCase()}s`);
  }
}

function syncSubjectsResults(resp) {
  if (resp && resp.data && resp.data.updateSubject) {
    resp.data.updateSubject.forEach(s => syncItem(s, `subjects`));
  }
}

const gqlResponse = (op, coll) => data => new Response(JSON.stringify({ data: { [op]: { [coll]: data } } }), { ok: true, status: 200 });

workbox.routing.registerRoute(
  /graphql/,
  ({ url, event }) => {
    event.respondWith(
      fetch(event.request).catch(err => {
        let { query, variables } = parseQueryString(url.search);

        if (query == allLabelColors) {
          return readTable("labelColors", "order").then(gqlResponse("allLabelColors", "LabelColors"));
        } else if (query == allSubjects) {
          return readTable("subjects", "name").then(gqlResponse("allSubjects", "Subjects"));
        } else if (query == allTags) {
          return readTable("tags", "name").then(gqlResponse("allTags", "Tags"));
        } else if (query == searchBooksQuery) {
          return readBooks(variables);
        }
      })
    );
  },
  "GET"
);

function syncItem(item, table, transform = item => item) {
  let open = indexedDB.open("books", 1);

  return new Promise(res => {
    open.onsuccess = evt => {
      let db = open.result;
      let tran = db.transaction(table, "readwrite");
      let objStore = tran.objectStore(table);
      objStore.get(item._id).onsuccess = ({ target: { result: itemToUpdate } }) => {
        Object.assign(itemToUpdate, transform(item));
        objStore.put(itemToUpdate).onsuccess = res;
      };
    };
  });
}

function deleteItem(_id, table) {
  let open = indexedDB.open("books", 1);

  return new Promise(res => {
    open.onsuccess = evt => {
      let db = open.result;
      let tran = db.transaction(table, "readwrite");
      let objStore = tran.objectStore(table);
      objStore.delete(_id).onsuccess = res;
    };
  });
}

self.addEventListener("push", () => {
  self.registration.showNotification("Push notification received!");
});

self.addEventListener("message", evt => {
  if (evt.data && evt.data.command == "do-sync") {
    masterSync();
  }
});

self.addEventListener("activate", masterSync);

const syncEvery = 1500 * 10; // 10 seconds

function masterSync() {
  let open = indexedDB.open("books", 1);

  open.onsuccess = async evt => {
    let db = open.result;
    if (db.objectStoreNames.contains("syncInfo")) {
      let [syncInfo = {}] = await readTable("syncInfo");

      if (Date.now() - syncInfo.lastSync > syncEvery) {
        let syncQuery = `/graphql/?query=${offlineUpdateSync}&variables=${JSON.stringify({ timestamp: syncInfo.lastSync })}`;
        let { data } = await doFetch(syncQuery).then(resp => resp.json());

        for (let b of data.allBooks.Books) await syncItem(b, "books", bookSyncTransform);
        for (let s of data.allSubjects.Subjects) await syncItem(s, "subjects");
        for (let t of data.allTags.Tags) await syncItem(t, "tags");

        for (let { _id } of data.deletedBooks._ids) await deleteItem(_id, "books");
        for (let { _id } of data.deletedSubjects._ids) await deleteItem(_id, "subjects");
        for (let { _id } of data.deletedTags._ids) await deleteItem(_id, "tags");
        await updateSyncInfo(db, { lastSync: +new Date() });
        console.log("SYNC COMPLETE");
      }
    }
  };
  open.onupgradeneeded = evt => {
    let db = open.result;
    if (!db.objectStoreNames.contains("books")) {
      let bookStore = db.createObjectStore("books", { keyPath: "_id" });
      bookStore.createIndex("imgSync", "imgSync", { unique: false });
      bookStore.createIndex("title_ci", "title_ci", { unique: false });
      bookStore.createIndex("dateAdded", "dateAdded", { unique: false });
      bookStore.createIndex("pages", "pages", { unique: false });
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

function readBooks(variableString) {
  let variables = JSON.parse(variableString);
  let { page = 1, pageSize = 50, title_contains, sort } = variables;

  let predicate = null;
  let limit = pageSize;
  let skipAmount = (page - 1) * pageSize;
  let skip, cursorSkip;

  if (title_contains) {
    let searchRegex = new RegExp(escapeRegex(title_contains), "i");
    predicate = book => searchRegex.test(book.title);
    cursorSkip = 0;
    skip = skipAmount;
  } else {
    cursorSkip = skipAmount;
    skip = 0;
  }

  let sortField = sort ? Object.keys(sort)[0] : null;

  let idx = !sort || sortField == "_id" ? "dateAdded" : sortField == "pages" ? "pages" : "title_ci";

  let idxDir = sortField && sort[sortField] == -1 ? "prev" : void 0;

  return readTable("books", idx, { predicate, skip, cursorSkip, limit, idxDir }).then(gqlResponse("allBooks", "Books", { Meta: { count: 12 } }));
}

function readTable(table, idxName = null, { predicate, idxDir, cursorSkip, skip, limit } = {}) {
  let open = indexedDB.open("books", 1);

  if (!predicate) {
    predicate = () => true;
  }

  return new Promise(resolve => {
    open.onsuccess = evt => {
      let db = open.result;
      let tran = db.transaction(table);
      let objStore = tran.objectStore(table);

      let tranCursor = idxName ? objStore.index(idxName).openCursor(null, idxDir) : objStore.openCursor(idxDir);
      let result = [];
      let skipped = 0;
      let hasSkipped = false;

      tranCursor.onsuccess = evt => {
        let cursor = evt.target.result;
        if (cursorSkip && !hasSkipped) {
          hasSkipped = true;
          return cursor.advance(cursorSkip);
        }
        if (!cursor) return resolve(result);

        let item = cursor.value;
        if (predicate(item)) {
          if (skip && skipped < skip) {
            skipped++;
          } else {
            result.push(item);
          }
          if (limit && result.length == limit) {
            return resolve(result);
          }
        }
        cursor.continue();
      };
    };
  });
}

async function syncImages(db, onComplete) {
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
              booksStore.put(bookToUpdate).onsuccess = res;
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
      updateSyncInfo(db, { lastSync: +new Date() });
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
  return new Promise(res => {
    req.onsuccess = ({ target: { result } }) => {
      Object.assign(result, updates);
      syncInfoStore.put(result).onsuccess = res;
    };
  });
}

function doBooksSync(db, onFinish, page = 1) {
  let pageSize = 50;
  getGraphqlResults(offlineBookSyncQuery, { page, pageSize }, "allBooks", "Books").then(books => {
    insertItems(db, books, "books", { transformItem: book => Object.assign(book, { imgSync: 0, title_ci: (book.title || "").toLowerCase() }) }).then(
      () => {
        if (books.length == pageSize) {
          doBooksSync(db, onFinish, page + 1);
        } else {
          syncImages(db, onFinish);
        }
      }
    );
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
    let img = await fetch(smallImage, { mode: "cors", credentials: "omit" });

    await cache.put(smallImage, img);
    return true;
  }

  if (/https:\/\/images-na\.ssl-images-amazon\.com/.test(smallImage)) {
    let cache = await caches.open("amazon-images1");
    let img = await fetch(smallImage, { mode: "cors", credentials: "omit" });
    await cache.put(smallImage, img);
    return true;
  }

  if (/https:\/\/ecx\.images-amazon\.com/.test(smallImage)) {
    let cache = await caches.open("amazon-images2");
    let img = await fetch(smallImage, { mode: "cors", credentials: "omit" });
    await cache.put(smallImage, img);
    return true;
  }
}
