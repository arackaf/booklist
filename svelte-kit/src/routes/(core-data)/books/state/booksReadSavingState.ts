import { writable } from "svelte/store";

export const booksReadSaving = writable<Record<string, string>>({});

export const startSaving = (ids: number | number[]) => {
  if (typeof ids === "number") {
    ids = [ids];
  }
  const idsStr: string[] = ids.map(id => "" + id);

  booksReadSaving.update(items => toRecord([...new Set([...Object.keys(items), ...idsStr])]));
};

export const endSaving = (ids: number | number[]) => {
  if (typeof ids === "number") {
    ids = [ids];
  }
  const idsStr: string[] = ids.map(id => "" + id);

  const lookup = new Set(idsStr);

  booksReadSaving.update(items => toRecord(Object.keys(items).filter(id => !lookup.has(id))));
};

const toRecord = (arr: string[]): Record<string, string> => {
  return arr.reduce((hash, s) => {
    hash[s] = "1";
    return hash;
  }, {} as Record<string, string>);
};
