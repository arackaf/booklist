export const sanitize = (searchParams: URLSearchParams) => {
  const keys = [...searchParams.keys()];
  for (const name of keys) {
    const allEntries = searchParams.getAll(name);

    if (allEntries.length === 1 && allEntries[0] === "") {
      searchParams.delete(name);
    }
  }
};
