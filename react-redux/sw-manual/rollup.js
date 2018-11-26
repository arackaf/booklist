(function () {
  'use strict';

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

  var extractedQueries = {"1":"mutation deleteBook($_id: String) {\n  deleteBook(_id: $_id)\n}\n","2":"query GetBookDetails($_id: String, $publicUserId: String) {\n  getBook(_id: $_id, publicUserId: $publicUserId) {\n    Book {\n      editorialReviews {\n        source\n        content\n      }\n      similarBooks {\n        title\n        authors\n        smallImage\n        asin\n      }\n    }\n  }\n}\n","3":"query SearchBooks($page: Int, $pageSize: Int, $sort: BookSort, $publicUserId: String, $title_contains: String, $isRead: Boolean, $isRead_ne: Boolean, $subjects_containsAny: [String], $searchChildSubjects: Boolean, $tags_containsAny: [String], $authors_textContains: String, $publisher_contains: String, $subjects_count: Int, $pages_lt: Int, $pages_gt: Int, $ver: String, $cache: Int) {\n  allBooks(PAGE: $page, PAGE_SIZE: $pageSize, SORT: $sort, title_contains: $title_contains, isRead: $isRead, isRead_ne: $isRead_ne, subjects_containsAny: $subjects_containsAny, searchChildSubjects: $searchChildSubjects, tags_containsAny: $tags_containsAny, authors_textContains: $authors_textContains, publisher_contains: $publisher_contains, publicUserId: $publicUserId, subjects_count: $subjects_count, pages_lt: $pages_lt, pages_gt: $pages_gt, ver: $ver, cache: $cache) {\n    Books {\n      _id\n      title\n      isbn\n      ean\n      pages\n      smallImage\n      publicationDate\n      subjects\n      authors\n      publisher\n      tags\n      isRead\n      dateAdded\n    }\n    Meta {\n      count\n    }\n  }\n}\n","4":"mutation updateBook($_id: String, $book: BookMutationInput) {\n  updateBook(_id: $_id, Updates: $book) {\n    Book {\n      _id\n      title\n      isbn\n      smallImage\n      pages\n      publisher\n      publicationDate\n      authors\n    }\n  }\n}\n","5":"mutation updateBooksRead($_ids: [String], $updates: BookMutationInput) {\n  updateBooks(_ids: $_ids, Updates: $updates) {\n    success\n  }\n}\n","6":"query GetPublicUser($_id: String, $cache: Int) {\n  getPublicUser(_id: $_id, cache: $cache) {\n    PublicUser {\n      publicName\n      publicBooksHeader\n    }\n  }\n}\n","7":"query HomeModuleBooks($page: Int, $pageSize: Int, $sort: BookSort, $title: String, $isRead: Boolean, $isRead_ne: Boolean, $subjects: [String], $searchChildSubjects: Boolean, $tags: [String], $ver: String, $cache: Int) {\n  allBooks(PAGE: $page, PAGE_SIZE: $pageSize, SORT: $sort, title_contains: $title, isRead: $isRead, isRead_ne: $isRead_ne, subjects_containsAny: $subjects, searchChildSubjects: $searchChildSubjects, tags_containsAny: $tags, ver: $ver, cache: $cache) {\n    Books {\n      _id\n      title\n      isbn\n      smallImage\n      subjects\n      authors\n      tags\n      isRead\n    }\n    Meta {\n      count\n    }\n  }\n}\n","8":"query labelColors {\n  allLabelColors(SORT: {order: 1}) {\n    LabelColors {\n      _id\n      backgroundColor\n      order\n    }\n  }\n}\n","9":"query GetUserPublicSettings {\n  getUser {\n    User {\n      isPublic\n      publicName\n      publicBooksHeader\n    }\n  }\n}\n","10":"mutation updateUser($isPublic: Boolean, $publicBooksHeader: String, $publicName: String) {\n  updateUser(Updates: {isPublic: $isPublic, publicBooksHeader: $publicBooksHeader, publicName: $publicName}) {\n    User {\n      isPublic\n      publicBooksHeader\n      publicName\n    }\n  }\n}\n","11":"query allSubjects($publicUserId: String) {\n  allSubjects(publicUserId: $publicUserId, SORT: {name: 1}) {\n    Subjects {\n      _id\n      name\n      backgroundColor\n      textColor\n      path\n    }\n  }\n}\n","12":"mutation deleteSubject($_id: String) {\n  deleteSubject(_id: $_id)\n}\n","13":"mutation updateSubject($_id: String, $name: String, $backgroundColor: String, $textColor: String, $parentId: String) {\n  updateSubject(_id: $_id, name: $name, backgroundColor: $backgroundColor, textColor: $textColor, parentId: $parentId) {\n    _id\n    name\n    backgroundColor\n    textColor\n    path\n  }\n}\n","14":"mutation createTag($name: String, $backgroundColor: String, $textColor: String) {\n  createTag(Tag: {name: $name, backgroundColor: $backgroundColor, textColor: $textColor}) {\n    Tag {\n      _id\n      name\n      backgroundColor\n      textColor\n    }\n  }\n}\n","15":"mutation deleteTag($_id: String) {\n  deleteTag(_id: $_id)\n}\n","16":"query allTags($publicUserId: String) {\n  allTags(publicUserId: $publicUserId, SORT: {name: 1}) {\n    Tags {\n      _id\n      name\n      backgroundColor\n      textColor\n      path\n    }\n  }\n}\n","17":"mutation updateTag($_id: String, $name: String, $backgroundColor: String, $textColor: String) {\n  updateTag(_id: $_id, Updates: {name: $name, backgroundColor: $backgroundColor, textColor: $textColor}) {\n    Tag {\n      _id\n      name\n      backgroundColor\n      textColor\n    }\n  }\n}\n"};

  function parserForArrayFormat(opts) {
    var result;

    switch (opts.arrayFormat) {
      case "index":
        return function(key, value, accumulator) {
          result = /\[(\d*)\]$/.exec(key);

          key = key.replace(/\[\d*\]$/, "");

          if (!result) {
            accumulator[key] = value;
            return;
          }

          if (accumulator[key] === undefined) {
            accumulator[key] = {};
          }

          accumulator[key][result[1]] = value;
        };

      case "bracket":
        return function(key, value, accumulator) {
          result = /(\[\])$/.exec(key);

          key = key.replace(/\[\]$/, "");

          if (!result || accumulator[key] === undefined) {
            accumulator[key] = value;
            return;
          }

          accumulator[key] = [].concat(accumulator[key], value);
        };

      default:
        return function(key, value, accumulator) {
          if (accumulator[key] === undefined) {
            accumulator[key] = value;
            return;
          }

          accumulator[key] = [].concat(accumulator[key], value);
        };
    }
  }

  function keysSorter(input) {
    if (Array.isArray(input)) {
      return input.sort();
    } else if (typeof input === "object") {
      return keysSorter(Object.keys(input))
        .sort(function(a, b) {
          return Number(a) - Number(b);
        })
        .map(function(key) {
          return input[key];
        });
    }

    return input;
  }

  function parseQueryString(str, opts) {
    opts = Object.assign({ arrayFormat: "none" }, opts);

    var formatter = parserForArrayFormat(opts);

    // Create an object with no prototype
    // https://github.com/sindresorhus/query-string/issues/47
    var ret = Object.create(null);

    if (typeof str !== "string") {
      return ret;
    }

    str = str.trim().replace(/^(\?|#|&)/, "");

    if (!str) {
      return ret;
    }

    str.split("&").forEach(function(param) {
      var parts = param.replace(/\+/g, " ").split("=");
      // Firefox (pre 40) decodes `%3D` to `=`
      // https://github.com/sindresorhus/query-string/pull/37
      var key = parts.shift();
      var val = parts.length > 0 ? parts.join("=") : undefined;

      // missing `=` should be `null`:
      // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
      val = val === undefined ? null : decodeURIComponent(val);

      formatter(decodeURIComponent(key), val, ret);
    });

    return Object.keys(ret)
      .sort()
      .reduce(function(result, key) {
        var val = ret[key];
        if (Boolean(val) && typeof val === "object" && !Array.isArray(val)) {
          // Sort object keys, not values
          result[key] = keysSorter(val);
        } else {
          result[key] = val;
        }

        return result;
      }, Object.create(null));
  }

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
          const graphqlQuery = extractedQueries[query];

          switch (true) {
            case /query SearchBooks/i.test(graphqlQuery):
              return searchBooks$1(variables, res => event.respondWith(res));
          }
        })
      );
    },
    "GET"
  );

  function searchBooks$1(variables, cb) {
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

}());
