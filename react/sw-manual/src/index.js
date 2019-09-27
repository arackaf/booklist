import escapeRegex from "./lib/escape-regex";
import parseQueryString from "./lib/query-string";

import { doFetch, gqlResponse, bookSyncTransform } from "./util";
import { fullSync } from "./initialSync";
import { readTable, readBooks } from "./indexedDbDataAccess";
import { updateSyncInfo } from "./indexedDbUpdateUtils";
import { syncItem, syncResultsFor, syncSubjectsResults } from "./incrementalSync";

import searchBooksQuery from "../../graphQL/books/getBooks.graphql";

import allSubjects from "../../graphQL/subjects/allSubjects.graphql";
import allTags from "../../graphQL/tags/getTags.graphql";
import allLabelColors from "../../graphQL/misc/allLabelColors.graphql";
import offlineUpdateSync from "../../graphQL/misc/offlineUpdateSync.graphql";

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

self.addEventListener("push", () => {
  self.registration.showNotification("Push notification received!");
});

self.addEventListener("message", evt => {
  if (evt.data && evt.data.command == "do-sync") {
    masterSync();
  }
});

self.addEventListener("activate", masterSync);

// workbox.routing.registerRoute(
//   /graphql/,
//   ({ url, event }) => {
//     return fetch(event.request).catch(err => {
//       let { query, variables } = parseQueryString(url.search);

//       if (query == allLabelColors) {
//         return readTable("labelColors", "order").then(gqlResponse("allLabelColors", "LabelColors"));
//       } else if (query == allSubjects) {
//         return readTable("subjects", "name").then(gqlResponse("allSubjects", "Subjects"));
//       } else if (query == allTags) {
//         return readTable("tags", "name").then(gqlResponse("allTags", "Tags"));
//       } else if (query == searchBooksQuery) {
//         return readBooks(variables);
//       }
//     });
//   },
//   "GET"
// );

// workbox.routing.registerRoute(
//   /graphql$/,
//   ({ url, event }) => {
//     let request = event.request.clone();

//     return fetch(event.request).then(response => {
//       let respClone = response.clone();
//       respClone.json().then(response => {
//         syncResultsFor({ request, response }, "Book", bookSyncTransform);
//         syncResultsFor({ request, response }, "Tag");
//         syncSubjectsResults(response);
//       });
//       return response;
//     });
//   },
//   "POST"
// );

function masterSync() {
  let open = indexedDB.open("books", 1);
  
  open.onsuccess = async evt => {
    const syncEvery = 1500 * 10; // 10 seconds
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
