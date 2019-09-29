import { gqlResponse } from "./util";
import escapeRegex from "./lib/escape-regex";
import { getLibraryDatabase } from "./indexedDbUtil";

export async function getSyncInfo() {
  let [syncInfo = {}] = await readTable("syncInfo");
  return syncInfo;
}

export function readBooks(variableString) {
  let variables = JSON.parse(variableString);
  let { page = 1, pageSize = 50, title_contains, sort } = variables;
  console.log("variables:", variables);

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

export function readTable(table, idxName = null, { predicate, idxDir, cursorSkip, skip, limit } = {}) {
  if (!predicate) {
    predicate = () => true;
  }

  return new Promise(resolve => {
    getLibraryDatabase(db => {
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
    });
  });
}
