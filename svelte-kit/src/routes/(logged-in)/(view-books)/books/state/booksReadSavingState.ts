import { writable } from "svelte/store";

export const booksReadSaving = writable<Record<string, string>>({});

export const startSaving = (_ids: string | string[]) => {
  if (typeof _ids === "string") {
    _ids = [_ids];
  }

  booksReadSaving.update(items => toRecord([...new Set([...Object.keys(items), ..._ids])]));
};

export const endSaving = (_ids: string | string[]) => {
  if (typeof _ids === "string") {
    _ids = [_ids];
  }
  const lookup = new Set(_ids);

  booksReadSaving.update(items => toRecord(Object.keys(items).filter(_id => !lookup.has(_id))));
};

const toRecord = (arr: string[]): Record<string, string> => {
  return arr.reduce((hash, s) => {
    hash[s] = "1";
    return hash;
  }, {} as Record<string, string>);
};
