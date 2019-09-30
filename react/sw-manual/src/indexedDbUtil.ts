const CURRENT_DB_VERSION = 1;

export function getLibraryDatabase(onSuccess) {
  try {
    indexedDB.deleteDatabase("books");
  } catch (er) {}
  openDb("mylibrary_io", CURRENT_DB_VERSION, onSuccess, (db, trans) => dbPrep(db, trans, onSuccess));
}

function dbPrep(db, trans, onComplete) {
  if (!db.objectStoreNames.contains("books")) {
    let bookStore = db.createObjectStore("books", { keyPath: "_id" });
    bookStore.createIndex("imgSync", "imgSync", { unique: false });
    bookStore.createIndex("title_ci", "title_ci", { unique: false });
    bookStore.createIndex("dateAdded", "dateAdded", { unique: false });
    bookStore.createIndex("pages", "pages", { unique: false });
  }
  if (!db.objectStoreNames.contains("syncInfo")) {
    db.createObjectStore("syncInfo", { keyPath: "id" });
    trans.objectStore("syncInfo").add({ id: 1, usersSyncd: {} });
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
  trans.oncomplete = () => onComplete(db);
}

export function openDb(name, version, onSuccess, onUpgradeNeeded) {
  let open = indexedDB.open(name, version);

  open.onsuccess = async evt => {
    let db = open.result;

    if (onSuccess) {
      onSuccess(db);
    }
  };
  open.onupgradeneeded = evt => {
    if (onUpgradeNeeded) {
      let db = open.result;
      let trans = evt.target.transaction;

      onUpgradeNeeded(db, trans);
    }
  };
}
