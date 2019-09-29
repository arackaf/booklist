import { deleteItem } from "./indexedDbUpdateUtils";
import { getLibraryDatabase } from "./indexedDbUtil";

export async function syncResultsFor({ request, response }, name, transform = item => item) {
  let createNameSingle = `create${name}`;
  if (response && response.data && response.data[createNameSingle] && response.data[createNameSingle][name]) {
    syncItem(transform(response.data[createNameSingle][name]), `${name.toLowerCase()}s`);
  }
  let updateNameSingle = `update${name}`;
  if (response && response.data && response.data[updateNameSingle] && response.data[updateNameSingle][name]) {
    syncItem(transform(response.data[updateNameSingle][name]), `${name.toLowerCase()}s`);
  }
  let updateNamePlural = `update${name}s`;
  if (response && response.data && response.data[updateNamePlural] && response.data[updateNamePlural][name + "s"]) {
    response.data[updateNamePlural][name + "s"].forEach(item => syncItem(transform(item), `${name.toLowerCase()}s`));
  }
  let deleteNameSingle = `delete${name}`;
  if (response && response.data && response.data[deleteNameSingle]) {
    let reqJson = await request.json();
    deleteItem(reqJson.variables._id, name.toLowerCase() + "s");
  }
}

export function syncSubjectsResults(resp) {
  if (resp && resp.data && resp.data.updateSubject) {
    resp.data.updateSubject.forEach(s => syncItem(s, `subjects`));
  }
}

export function syncItem(item, table, transform = item => item) {
  return new Promise(res => {
    getLibraryDatabase(db => {
      let tran = db.transaction(table, "readwrite");
      let objStore = tran.objectStore(table);
      objStore.get(item._id).onsuccess = ({ target: { result: itemToUpdate } }) => {
        if (!itemToUpdate) {
          objStore.add(transform(item)).onsuccess = res;
        } else {
          Object.assign(itemToUpdate, transform(item));
          objStore.put(itemToUpdate).onsuccess = res;
        }
      };
    });
  });
}
