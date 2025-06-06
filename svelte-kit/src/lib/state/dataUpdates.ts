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

export const runUpdate = <T>(currentItems: T[], id: number | number[], updates: UpdatesTo<T>) => {
  const ids: number[] = Array.isArray(id) ? id : [id];
  updateItems(currentItems, ids, updates);
};

export const updateItems = <T>(currentItems: T[], ids: number[], updates: UpdatesTo<T>) => {
  const _idLookup = new Set(ids);

  currentItems.forEach((item: any, idx: number) => {
    if (!_idLookup.has(item.id)) {
      return item;
    }

    const update = updateSingleObject(item, updates);
    currentItems[idx] = update;
  });
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

type WithId = {
  id: number;
};

export const runDelete = <T extends WithId>(currentItems: T[], id: number | number[]) => {
  const ids: number[] = Array.isArray(id) ? id : [id];
  for (const currentId of ids) {
    for (let i = currentItems.length - 1; i >= 0; i--) {
      if (currentItems[i].id === currentId) {
        currentItems.splice(i, 1);
      }
    }
  }
};
