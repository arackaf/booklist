var lib =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./extracted-queries.js":
/*!******************************!*\
  !*** ./extracted-queries.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"1\":\"mutation deleteBook($_id: String) {\\n  deleteBook(_id: $_id)\\n}\\n\",\"2\":\"query GetBookDetails($_id: String, $publicUserId: String) {\\n  getBook(_id: $_id, publicUserId: $publicUserId) {\\n    Book {\\n      editorialReviews {\\n        source\\n        content\\n      }\\n      similarBooks {\\n        title\\n        authors\\n        smallImage\\n        asin\\n      }\\n    }\\n  }\\n}\\n\",\"3\":\"query SearchBooks($page: Int, $pageSize: Int, $sort: BookSort, $publicUserId: String, $title_contains: String, $isRead: Boolean, $isRead_ne: Boolean, $subjects_containsAny: [String], $searchChildSubjects: Boolean, $tags_containsAny: [String], $authors_textContains: String, $publisher_contains: String, $subjects_count: Int, $pages_lt: Int, $pages_gt: Int, $ver: String, $cache: Int) {\\n  allBooks(PAGE: $page, PAGE_SIZE: $pageSize, SORT: $sort, title_contains: $title_contains, isRead: $isRead, isRead_ne: $isRead_ne, subjects_containsAny: $subjects_containsAny, searchChildSubjects: $searchChildSubjects, tags_containsAny: $tags_containsAny, authors_textContains: $authors_textContains, publisher_contains: $publisher_contains, publicUserId: $publicUserId, subjects_count: $subjects_count, pages_lt: $pages_lt, pages_gt: $pages_gt, ver: $ver, cache: $cache) {\\n    Books {\\n      _id\\n      title\\n      isbn\\n      ean\\n      pages\\n      smallImage\\n      publicationDate\\n      subjects\\n      authors\\n      publisher\\n      tags\\n      isRead\\n      dateAdded\\n    }\\n    Meta {\\n      count\\n    }\\n  }\\n}\\n\",\"4\":\"mutation updateBook($_id: String, $book: BookMutationInput) {\\n  updateBook(_id: $_id, Updates: $book) {\\n    Book {\\n      _id\\n      title\\n      isbn\\n      smallImage\\n      pages\\n      publisher\\n      publicationDate\\n      authors\\n    }\\n  }\\n}\\n\",\"5\":\"mutation updateBooksRead($_ids: [String], $updates: BookMutationInput) {\\n  updateBooks(_ids: $_ids, Updates: $updates) {\\n    success\\n  }\\n}\\n\",\"6\":\"query GetPublicUser($_id: String, $cache: Int) {\\n  getPublicUser(_id: $_id, cache: $cache) {\\n    PublicUser {\\n      publicName\\n      publicBooksHeader\\n    }\\n  }\\n}\\n\",\"7\":\"query HomeModuleBooks($page: Int, $pageSize: Int, $sort: BookSort, $title: String, $isRead: Boolean, $isRead_ne: Boolean, $subjects: [String], $searchChildSubjects: Boolean, $tags: [String], $ver: String, $cache: Int) {\\n  allBooks(PAGE: $page, PAGE_SIZE: $pageSize, SORT: $sort, title_contains: $title, isRead: $isRead, isRead_ne: $isRead_ne, subjects_containsAny: $subjects, searchChildSubjects: $searchChildSubjects, tags_containsAny: $tags, ver: $ver, cache: $cache) {\\n    Books {\\n      _id\\n      title\\n      isbn\\n      smallImage\\n      subjects\\n      authors\\n      tags\\n      isRead\\n    }\\n    Meta {\\n      count\\n    }\\n  }\\n}\\n\",\"8\":\"query labelColors {\\n  allLabelColors(SORT: {order: 1}) {\\n    LabelColors {\\n      _id\\n      backgroundColor\\n      order\\n    }\\n  }\\n}\\n\",\"9\":\"query GetUserPublicSettings {\\n  getUser {\\n    User {\\n      isPublic\\n      publicName\\n      publicBooksHeader\\n    }\\n  }\\n}\\n\",\"10\":\"mutation updateUser($isPublic: Boolean, $publicBooksHeader: String, $publicName: String) {\\n  updateUser(Updates: {isPublic: $isPublic, publicBooksHeader: $publicBooksHeader, publicName: $publicName}) {\\n    User {\\n      isPublic\\n      publicBooksHeader\\n      publicName\\n    }\\n  }\\n}\\n\",\"11\":\"query allSubjects($publicUserId: String) {\\n  allSubjects(publicUserId: $publicUserId, SORT: {name: 1}) {\\n    Subjects {\\n      _id\\n      name\\n      backgroundColor\\n      textColor\\n      path\\n    }\\n  }\\n}\\n\",\"12\":\"mutation deleteSubject($_id: String) {\\n  deleteSubject(_id: $_id)\\n}\\n\",\"13\":\"mutation updateSubject($_id: String, $name: String, $backgroundColor: String, $textColor: String, $parentId: String) {\\n  updateSubject(_id: $_id, name: $name, backgroundColor: $backgroundColor, textColor: $textColor, parentId: $parentId) {\\n    _id\\n    name\\n    backgroundColor\\n    textColor\\n    path\\n  }\\n}\\n\",\"14\":\"mutation createTag($name: String, $backgroundColor: String, $textColor: String) {\\n  createTag(Tag: {name: $name, backgroundColor: $backgroundColor, textColor: $textColor}) {\\n    Tag {\\n      _id\\n      name\\n      backgroundColor\\n      textColor\\n    }\\n  }\\n}\\n\",\"15\":\"mutation deleteTag($_id: String) {\\n  deleteTag(_id: $_id)\\n}\\n\",\"16\":\"query allTags($publicUserId: String) {\\n  allTags(publicUserId: $publicUserId, SORT: {name: 1}) {\\n    Tags {\\n      _id\\n      name\\n      backgroundColor\\n      textColor\\n      path\\n    }\\n  }\\n}\\n\",\"17\":\"mutation updateTag($_id: String, $name: String, $backgroundColor: String, $textColor: String) {\\n  updateTag(_id: $_id, Updates: {name: $name, backgroundColor: $backgroundColor, textColor: $textColor}) {\\n    Tag {\\n      _id\\n      name\\n      backgroundColor\\n      textColor\\n    }\\n  }\\n}\\n\"});\n\n//# sourceURL=webpack://lib/./extracted-queries.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _update_sync__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./update-sync */ \"./update-sync.js\");\n/* harmony import */ var _update_sync__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_update_sync__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _extracted_queries__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extracted-queries */ \"./extracted-queries.js\");\n/* harmony import */ var _query_string__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./query-string */ \"./query-string.js\");\n\r\n\r\n\r\n\r\nworkbox.routing.registerRoute(\r\n  /graphql$/,\r\n  ({ url, event }) => {\r\n    //turning this off for now, until I can wrap some other things up\r\n    return fetch(event.request);\r\n\r\n    return fetch(request).then(response => {\r\n      let respClone = response.clone();\r\n      setTimeout(() => {\r\n        respClone.json().then(resp => {\r\n          if (resp && resp.data && resp.data.updateBook && resp.data.updateBook.Book) {\r\n            syncBook(resp.data.updateBook.Book);\r\n          }\r\n        }, 5);\r\n      });\r\n      return response;\r\n    });\r\n  },\r\n  \"POST\"\r\n);\r\n\r\nworkbox.routing.registerRoute(\r\n  /graphql/,\r\n  ({ url, event }) => {\r\n    event.respondWith(\r\n      fetch(event.request).catch(err => {\r\n        const { query, variables } = Object(_query_string__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(url.search);\r\n        const graphqlQuery = _extracted_queries__WEBPACK_IMPORTED_MODULE_1__[\"default\"][query];\r\n\r\n        switch (true) {\r\n          case /query SearchBooks/i.test(graphqlQuery):\r\n            return searchBooks(variables, res => event.respondWith(res));\r\n        }\r\n      })\r\n    );\r\n  },\r\n  \"GET\"\r\n);\r\n\r\nfunction searchBooks(variables, cb) {\r\n  return new Response(\r\n    JSON.stringify({\r\n      data: {}\r\n    }),\r\n    { ok: true, status: 200 }\r\n  );\r\n}\r\n\r\nfunction syncBook(book) {\r\n  let open = indexedDB.open(\"books\", 1);\r\n\r\n  open.onsuccess = evt => {\r\n    let db = open.result;\r\n    if (db.objectStoreNames.contains(\"books\")) {\r\n      let tran = db.transaction(\"books\", \"readwrite\");\r\n      let booksStore = tran.objectStore(\"books\");\r\n      booksStore.get(book._id).onsuccess = ({ target: { result: bookToUpdate } }) => {\r\n        [\"title\", \"authors\", \"isbn\"].forEach(prop => (bookToUpdate[prop] = book[prop]));\r\n        booksStore.put(bookToUpdate);\r\n      };\r\n    }\r\n  };\r\n}\r\n\r\nself.addEventListener(\"push\", () => {\r\n  console.log(\"Push notification received!!!\");\r\n  self.registration.showNotification(\"Push notification received!\");\r\n});\r\n\r\nself.addEventListener(\"message\", evt => {\r\n  if (evt.data && evt.data.command == \"do-sync\") {\r\n    masterSync();\r\n  }\r\n});\r\n\r\nself.addEventListener(\"activate\", masterSync);\r\n\r\nfunction masterSync() {\r\n  let open = indexedDB.open(\"books\", 1);\r\n\r\n  open.onupgradeneeded = evt => {\r\n    console.log(\"Setting up DB\");\r\n    let db = open.result;\r\n    if (!db.objectStoreNames.contains(\"books\")) {\r\n      let bookStore = db.createObjectStore(\"books\", { keyPath: \"_id\" });\r\n      bookStore.createIndex(\"imgSync\", \"imgSync\", { unique: false });\r\n    }\r\n    if (!db.objectStoreNames.contains(\"syncInfo\")) {\r\n      db.createObjectStore(\"syncInfo\", { keyPath: \"id\" });\r\n      evt.target.transaction\r\n        .objectStore(\"syncInfo\")\r\n        .add({ id: 1, lastImgSync: null, lastImgSyncStarted: null, lastLoadStarted: +new Date(), lastLoad: null });\r\n    }\r\n    evt.target.transaction.oncomplete = fullSync;\r\n  };\r\n}\r\n\r\nfunction syncImages(db) {\r\n  console.log(\"SYNCING IMAGES\");\r\n  let tran = db.transaction(\"books\");\r\n  let booksStore = tran.objectStore(\"books\");\r\n  let idx = booksStore.index(\"imgSync\");\r\n  let booksCursor = idx.openCursor(0);\r\n  let booksToUpdate = [];\r\n\r\n  booksCursor.onsuccess = evt => {\r\n    let cursor = evt.target.result;\r\n    if (!cursor) return runIt();\r\n\r\n    let book = cursor.value;\r\n    booksToUpdate.push({ _id: book._id, smallImage: book.smallImage });\r\n    cursor.continue();\r\n  };\r\n\r\n  async function runIt() {\r\n    if (!booksToUpdate.length) return;\r\n\r\n    for (let _book of booksToUpdate) {\r\n      try {\r\n        let imgCached = await preCacheBookImage(_book);\r\n        if (imgCached) {\r\n          let tran = db.transaction(\"books\", \"readwrite\");\r\n          let booksStore = tran.objectStore(\"books\");\r\n          await new Promise(res => {\r\n            let req = booksStore.get(_book._id);\r\n            req.onsuccess = ({ target: { result: bookToUpdate } }) => {\r\n              bookToUpdate.imgSync = 1;\r\n              booksStore.put(bookToUpdate);\r\n              res();\r\n            };\r\n            req.onerror = () => res();\r\n          });\r\n        }\r\n      } catch (er) {\r\n        console.log(\"ERROR\", er);\r\n      } finally {\r\n      }\r\n    }\r\n  }\r\n}\r\n\r\nconst doFetch = (url, data) =>\r\n  fetch(url, {\r\n    method: \"post\",\r\n    credentials: \"include\",\r\n    headers: {\r\n      Accept: \"application/json\",\r\n      \"Content-Type\": \"application/json\"\r\n    },\r\n    body: JSON.stringify(data)\r\n  });\r\n\r\nfunction fullSync(page = 1) {\r\n  let open = indexedDB.open(\"books\", 1);\r\n\r\n  // Set up the database schema\r\n  open.onsuccess = evt => {\r\n    let db = open.result;\r\n    fullSyncPage(db, 1);\r\n  };\r\n}\r\n\r\nfunction fullSyncPage(db, page) {\r\n  let pageSize = 50;\r\n  doFetch(\"/book/offlineSync\", { page, pageSize })\r\n    .then(resp => resp.json())\r\n    .then(resp => {\r\n      if (!resp.books) return;\r\n      let books = resp.books;\r\n      let count = books.count;\r\n      let i = 0;\r\n      putNext();\r\n\r\n      function putNext() {\r\n        if (i < pageSize) {\r\n          let book = books[i++];\r\n          if (!book) {\r\n            loadDone(db);\r\n            return;\r\n          }\r\n\r\n          let transaction = db.transaction(\"books\", \"readwrite\");\r\n          let booksStore = transaction.objectStore(\"books\");\r\n          booksStore.add(Object.assign(book, { imgSync: 0 })).onsuccess = putNext;\r\n        } else {\r\n          if (books.length > pageSize) {\r\n            fullSyncPage(db, page + 1);\r\n          } else {\r\n            loadDone(db);\r\n          }\r\n        }\r\n      }\r\n    });\r\n\r\n  async function loadDone(db) {\r\n    await syncImages(db);\r\n    let transaction = db.transaction(\"syncInfo\", \"readwrite\");\r\n    let syncInfoStore = transaction.objectStore(\"syncInfo\");\r\n    let req = syncInfoStore.get(1);\r\n    req.onsuccess = ({ target: { result } }) => {\r\n      Object.assign(result, { lastLoad: +new Date(), lastLoadStarted: null });\r\n      syncInfoStore.put(result);\r\n    };\r\n  }\r\n}\r\n\r\nasync function preCacheBookImage(book) {\r\n  let smallImage = book.smallImage;\r\n  if (!smallImage) return;\r\n\r\n  let cachedImage = await caches.match(smallImage);\r\n  if (cachedImage) return;\r\n\r\n  if (/https:\\/\\/s3.amazonaws.com\\/my-library-cover-uploads/.test(smallImage)) {\r\n    let cache = await caches.open(\"local-images1\");\r\n    let img = await fetch(smallImage, { mode: \"no-cors\" });\r\n    await cache.put(smallImage, img);\r\n    return true;\r\n  }\r\n\r\n  if (/https:\\/\\/images-na\\.ssl-images-amazon\\.com/.test(smallImage)) {\r\n    let cache = await caches.open(\"amazon-images1\");\r\n    let img = await fetch(smallImage, { mode: \"no-cors\" });\r\n    await cache.put(smallImage, img);\r\n    return true;\r\n  }\r\n\r\n  if (/https:\\/\\/ecx\\.images-amazon\\.com/.test(smallImage)) {\r\n    let cache = await caches.open(\"amazon-images1\");\r\n    let img = await fetch(smallImage, { mode: \"no-cors\" });\r\n    await cache.put(smallImage, img);\r\n    return true;\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack://lib/./index.js?");

/***/ }),

/***/ "./query-string.js":
/*!*************************!*\
  !*** ./query-string.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\r\n\r\nfunction parserForArrayFormat(opts) {\r\n  var result;\r\n\r\n  switch (opts.arrayFormat) {\r\n    case \"index\":\r\n      return function(key, value, accumulator) {\r\n        result = /\\[(\\d*)\\]$/.exec(key);\r\n\r\n        key = key.replace(/\\[\\d*\\]$/, \"\");\r\n\r\n        if (!result) {\r\n          accumulator[key] = value;\r\n          return;\r\n        }\r\n\r\n        if (accumulator[key] === undefined) {\r\n          accumulator[key] = {};\r\n        }\r\n\r\n        accumulator[key][result[1]] = value;\r\n      };\r\n\r\n    case \"bracket\":\r\n      return function(key, value, accumulator) {\r\n        result = /(\\[\\])$/.exec(key);\r\n\r\n        key = key.replace(/\\[\\]$/, \"\");\r\n\r\n        if (!result || accumulator[key] === undefined) {\r\n          accumulator[key] = value;\r\n          return;\r\n        }\r\n\r\n        accumulator[key] = [].concat(accumulator[key], value);\r\n      };\r\n\r\n    default:\r\n      return function(key, value, accumulator) {\r\n        if (accumulator[key] === undefined) {\r\n          accumulator[key] = value;\r\n          return;\r\n        }\r\n\r\n        accumulator[key] = [].concat(accumulator[key], value);\r\n      };\r\n  }\r\n}\r\n\r\nfunction encode(value, opts) {\r\n  if (opts.encode) {\r\n    return encodeURIComponent(value);\r\n  }\r\n\r\n  return value;\r\n}\r\n\r\nfunction keysSorter(input) {\r\n  if (Array.isArray(input)) {\r\n    return input.sort();\r\n  } else if (typeof input === \"object\") {\r\n    return keysSorter(Object.keys(input))\r\n      .sort(function(a, b) {\r\n        return Number(a) - Number(b);\r\n      })\r\n      .map(function(key) {\r\n        return input[key];\r\n      });\r\n  }\r\n\r\n  return input;\r\n}\r\n\r\nfunction parseQueryString(str, opts) {\r\n  opts = Object.assign({ arrayFormat: \"none\" }, opts);\r\n\r\n  var formatter = parserForArrayFormat(opts);\r\n\r\n  // Create an object with no prototype\r\n  // https://github.com/sindresorhus/query-string/issues/47\r\n  var ret = Object.create(null);\r\n\r\n  if (typeof str !== \"string\") {\r\n    return ret;\r\n  }\r\n\r\n  str = str.trim().replace(/^(\\?|#|&)/, \"\");\r\n\r\n  if (!str) {\r\n    return ret;\r\n  }\r\n\r\n  str.split(\"&\").forEach(function(param) {\r\n    var parts = param.replace(/\\+/g, \" \").split(\"=\");\r\n    // Firefox (pre 40) decodes `%3D` to `=`\r\n    // https://github.com/sindresorhus/query-string/pull/37\r\n    var key = parts.shift();\r\n    var val = parts.length > 0 ? parts.join(\"=\") : undefined;\r\n\r\n    // missing `=` should be `null`:\r\n    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters\r\n    val = val === undefined ? null : decodeURIComponent(val);\r\n\r\n    formatter(decodeURIComponent(key), val, ret);\r\n  });\r\n\r\n  return Object.keys(ret)\r\n    .sort()\r\n    .reduce(function(result, key) {\r\n      var val = ret[key];\r\n      if (Boolean(val) && typeof val === \"object\" && !Array.isArray(val)) {\r\n        // Sort object keys, not values\r\n        result[key] = keysSorter(val);\r\n      } else {\r\n        result[key] = val;\r\n      }\r\n\r\n      return result;\r\n    }, Object.create(null));\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (parseQueryString);\r\n\n\n//# sourceURL=webpack://lib/./query-string.js?");

/***/ }),

/***/ "./update-sync.js":
/*!************************!*\
  !*** ./update-sync.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("self.addEventListener(\"message\", event => {\r\n  if (event.data == \"sw-update-accepted\") {\r\n    self.skipWaiting().then(() => {\r\n      self.clients.claim().then(() => {\r\n        self.clients.matchAll().then(clients => {\r\n          clients.forEach(client => client.postMessage(\"sw-updated\"));\r\n        });\r\n      });\r\n    });\r\n  }\r\n});\r\n\n\n//# sourceURL=webpack://lib/./update-sync.js?");

/***/ })

/******/ });