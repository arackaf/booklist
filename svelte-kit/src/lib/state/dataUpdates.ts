import { get, type Writable } from "svelte/store";

type ArraySync<ArrType> = {
  push?: ArrType[];
  pull?: ArrType[];
};

type ArrayKeys<T> = {
  [k in keyof T]: T[k] extends Array<unknown> ? k : never;
}[keyof T];

type ArraySyncs<T> = {
  [k in ArrayKeys<T>]: T[k] extends Array<infer U> ? ArraySync<U> : never;
};

export type UpdatesTo<T> = {
  fieldsSet?: Partial<T>;
  arraySync?: Partial<ArraySyncs<T>>;
};

export const runUpdate = <T>(currentItems: Writable<T[]>, _id: string | string[], updates: UpdatesTo<T>) => {
  const _ids: string[] = Array.isArray(_id) ? _id : [_id];
  updateItems(currentItems, _ids, updates);
};

export const updateItems = <T>(store: Writable<T[]>, _ids: string[], updates: UpdatesTo<T>) => {
  const currentItems = get(store);
  const _idLookup = new Set(_ids);

  const updatedItems = currentItems.map((item: any) => {
    if (!_idLookup.has(item._id)) {
      return item;
    }

    return updateSingleObject(item, updates);
  });

  store.set(updatedItems);
};

export const updateSingleObject = <T extends object>(item: T, updates: UpdatesTo<T>) => {
  const { fieldsSet, arraySync } = updates;
  item = { ...item };

  if (fieldsSet) {
    Object.assign(item, fieldsSet);
  }
  if (arraySync) {
    for (const key of Object.keys(arraySync)) {
      const updates: ArraySync<unknown> = (arraySync as any)[key];

      // @ts-ignore
      const lookup = new Set(item[key]);
      updates.push?.forEach(adding => lookup.add(adding));
      updates.pull?.forEach(removing => lookup.delete(removing));

      // @ts-ignore
      item[key] = [...lookup];
    }
  }
  return item;
};

type MongoObject = {
  _id: string;
};

export const runDelete = <T extends MongoObject>(currentItems: Writable<T[]>, _id: string | string[]) => {
  const _ids: string[] = Array.isArray(_id) ? _id : [_id];
  deleteItems(currentItems, _ids);
};

export const deleteItems = <T extends MongoObject>(store: Writable<T[]>, _ids: string[]) => {
  const idLookup = new Set(_ids);

  store.update(items =>
    items.filter(item => {
      return !idLookup.has(item._id);
    })
  );
};
