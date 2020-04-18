import { doFetch, bookSyncTransform } from "./util";
import { updateSyncInfo, insertItems, deleteItem } from "./indexedDbUpdateUtils";
import { getLibraryDatabase } from "./indexedDbUtil";
import { syncItem } from "./incrementalSync";

import allSubjects from "../../graphQL/subjects/allSubjects.graphql";
import allTags from "../../graphQL/tags/getTags.graphql";
import allLabelColors from "../../graphQL/misc/allLabelColors.graphql";
import offlineUpdateSync from "../../graphQL/misc/offlineUpdateSync.graphql";
import initialOfflineBookSync from "../../graphQL/books/initialOfflineBookSync.graphql";
import { readTableCount } from "./indexedDbDataAccess";

export function setUserLastSync(userId, lastSync) {
  return updateSyncInfo(syncInfo => {
    syncInfo.usersSyncd[userId] = Object.assign(syncInfo.usersSyncd[userId] || {}, { lastSync });
    return syncInfo;
  });
}

export async function incrementalSync(userId, lastSync) {
  let syncQuery = `/graphql/?query=${offlineUpdateSync}&variables=${JSON.stringify({ timestamp: lastSync })}`;
  let { data } = await doFetch(syncQuery).then(resp => resp.json());

  for (let b of data.allBooks.Books) await syncItem(b, "books", bookSyncTransform);
  for (let s of data.allSubjects.Subjects) await syncItem(s, "subjects");
  for (let t of data.allTags.Tags) await syncItem(t, "tags");

  for (let { _id } of data.deletedBooks._ids) await deleteItem(_id, "books");
  for (let { _id } of data.deletedSubjects._ids) await deleteItem(_id, "subjects");
  for (let { _id } of data.deletedTags._ids) await deleteItem(_id, "tags");
  await setUserLastSync(userId, +new Date());
  console.log("INCREMENTAL SYNC COMPLETE");
}

export function fullSync(userId) {
  getLibraryDatabase(db => {
    Promise.all([new Promise(res => doBooksSync(db, res)), doSubjectsSync(db), doTagsSync(db), doLabelColorsSync(db)]).then(() => {
      return setUserLastSync(userId, +new Date());
    });
  });
}

function doBooksSync(db, onFinish, page = 1) {
  let pageSize = 50;
  getGraphqlResults(initialOfflineBookSync, { page, pageSize }, "allBooks", "Books").then(books => {
    insertItems(db, books, "books", {
      transformItem: book => Object.assign(book, { imgSync: 0, title_ci: (book.title || "").toLowerCase() })
    }).then(() => {
      if (books.length == pageSize) {
        doBooksSync(db, onFinish, page + 1);
      } else {
        syncImages(db, onFinish);
      }
    });
  });
}

function doSubjectsSync(db) {
  return getGraphqlResults(allSubjects, {}, "allSubjects", "Subjects").then(subjects => insertItems(db, subjects, "subjects"));
}

function doTagsSync(db) {
  return getGraphqlResults(allTags, {}, "allTags", "Tags").then(tags => insertItems(db, tags, "tags"));
}

async function doLabelColorsSync(db) {
  if ((await readTableCount("labelColors")) > 0) return;
  return getGraphqlResults(allLabelColors, {}, "allLabelColors", "LabelColors").then(labelColors => insertItems(db, labelColors, "labelColors"));
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
    onComplete();
    return;
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

function getGraphqlResults(query, variables, op, name) {
  return doFetch(`/graphql/?query=${query}&variables=${JSON.stringify(variables)}`)
    .then(resp => resp.json())
    .then(resp => {
      return resp.data && resp.data[op] && resp.data[op][name];
    });
}
