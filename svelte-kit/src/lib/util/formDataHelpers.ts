export const sanitize = (searchParams: URLSearchParams) => {
  const keys = [...searchParams.keys()];
  for (const name of keys) {
    const allEntries = searchParams.getAll(name);

    if (allEntries.length === 1 && allEntries[0] === "") {
      searchParams.delete(name);
    }
  }
};

type Lookup = {
  [k: string]: string | number | string[] | null;
};

type Options = {
  strings?: string[];
  numbers?: string[];
  optionals?: string[];
  arrays?: string[];
};

export const toJson = (params: URLSearchParams, options: Options) => {
  const result: Lookup = {};

  options.strings?.forEach(k => {
    result[k] = params.get(k) ?? "";
  });
  options.numbers?.forEach(k => {
    const val = params.get(k);
    if (val == null || val === "") {
      result[k] = null;
    } else {
      result[k] = parseInt(val) || null;
    }
  });
  options.optionals?.forEach(k => {
    const val = params.get(k);
    if (val != null) {
      result[k] = val;
    }
  });

  options.arrays?.forEach(k => {
    result[k] = params.getAll(k);
  });

  return result;
};

export const removeEmpty = <T extends object>(obj: T): Partial<T> => {
  return Object.entries(obj)
    .filter(([, v]) => v)
    .reduce((obj, [k, v]) => {
      obj[k] = v;
      return obj;
    }, {} as any);
};
