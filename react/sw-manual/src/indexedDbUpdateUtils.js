import { getLibraryDatabase } from "./indexedDbUtil";

export function insertItems(db, items, storeName, { transformItem = x => x } = {}) {
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

export function updateSyncInfo(db, updates) {
  let transaction = db.transaction("syncInfo", "readwrite");
  let syncInfoStore = transaction.objectStore("syncInfo");
  let req = syncInfoStore.get(1);
  return new Promise(res => {
    req.onsuccess = ({ target: { result } }) => {
      if (typeof updates === "function") {
        result = updates(result);
      } else {
        Object.assign(result, updates);
      }
      syncInfoStore.put(result).onsuccess = res;
    };
  });
}

export function deleteItem(_id, table) {
  return new Promise(res => {
    getLibraryDatabase(db => {
      let tran = db.transaction(table, "readwrite");
      let objStore = tran.objectStore(table);
      objStore.delete(_id).onsuccess = res;
    });
  });
}
