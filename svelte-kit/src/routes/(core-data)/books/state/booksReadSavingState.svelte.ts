export const booksReadSaving = $state<Record<string, string>>({});

export const startSaving = (ids: number | number[]) => {
  if (typeof ids === "number") {
    ids = [ids];
  }

  for (const id of ids.map(id => "" + id)) {
    booksReadSaving[id] = "1";
  }
};

export const endSaving = (ids: number | number[]) => {
  if (typeof ids === "number") {
    ids = [ids];
  }

  for (const id of ids.map(id => "" + id)) {
    delete booksReadSaving[id];
  }
};
