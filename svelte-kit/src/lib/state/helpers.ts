import type { Hash } from "$data/types";

type WithId = {
  id: string;
};

export const toHash = <T extends WithId>(items: T[]): Hash<T> => {
  return items.reduce<Hash<T>>((hash, tag) => {
    hash[tag.id] = tag;
    return hash;
  }, {});
};
