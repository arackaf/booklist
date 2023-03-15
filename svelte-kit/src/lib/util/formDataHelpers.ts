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
  [k: string]: string | number | string[] | number[] | null;
};

type Options = {
  strings?: string[];
  numbers?: string[];
  optionals?: string[];
  optionalObjects?: string[];
  arrays?: string[];
  numberArrays?: string[];
};

export const toJson = (params: FormData, options: Options) => {
  const result: Lookup = {};

  options.strings?.forEach(k => {
    result[k] = params.get(k)?.toString() ?? "";
  });
  options.numbers?.forEach(k => {
    const val = params.get(k);
    if (val == null || val === "") {
      result[k] = null;
    } else {
      result[k] = parseInt(val.toString()) || null;
    }
  });
  options.optionals?.forEach(k => {
    const val = params.get(k);
    if (val != null) {
      result[k] = val.toString();
    }
  });
  options.optionalObjects?.forEach(k => {
    const val = params.get(k);
    if (val) {
      try {
        result[k] = JSON.parse(val.toString());
      } catch (er) {
        result[k] = null;
      }
    }
  });

  options.arrays?.forEach(k => {
    result[k] = params.getAll(k).map(val => val.toString());
  });

  options.numberArrays?.forEach(k => {
    result[k] = params.getAll(k).map(val => +val);
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
