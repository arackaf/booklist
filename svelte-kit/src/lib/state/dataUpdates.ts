import { get, type Writable } from "svelte/store";

export type UpdatesTo<T> = {
  fieldsSet: Partial<T>;
};

export const runUpdate = <T>(currentItems: Writable<T[]>, _id: string | string[], updates: UpdatesTo<T>) => {
  const _ids: string[] = Array.isArray(_id) ? _id : [_id];
  updateItems(currentItems, _ids, updates);
};

export const updateItems = <T>(store: Writable<T[]>, _ids: string[], updates: UpdatesTo<T>) => {
  const currentItems = get(store);

  const { fieldsSet } = updates;
  const _idLookup = new Set(_ids);

  const updatedItems = currentItems.map((item: any) => {
    if (!_idLookup.has(item._id)) {
      return item;
    }

    const result = Object.assign({}, item, fieldsSet);
    return result;
  });

  store.set(updatedItems);
};
