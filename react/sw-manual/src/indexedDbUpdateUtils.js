import { getLibraryDatabase } from "./indexedDbUtil";
import { getSyncInfo } from "./indexedDbDataAccess";

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

export async function updateSyncInfo(updates) {
  let syncInfo = await getSyncInfo();
  return new Promise(res => {
    getLibraryDatabase(db => {
      let transaction = db.transaction("syncInfo", "readwrite");
      let syncInfoStore = transaction.objectStore("syncInfo");

      if (typeof updates === "function") {
        syncInfo = updates(syncInfo);
      } else {
        Object.assign(syncInfo, updates);
      }
      syncInfoStore.put(syncInfo).onsuccess = res;
    });
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
