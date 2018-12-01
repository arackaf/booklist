export const args = (...args) => args.filter(s => s).join("\n");

export const boolArg = (name, value, emptyVal = "") => {
  if (value == null || value === emptyVal) return "";

  return `${name}:${value ? true : false}`;
};

export const strArrArg = (name, values, sendEmpty = false) => {
  if (values == null || (!sendEmpty && !values.length)) return "";

  return `${name}:${JSON.stringify(values)}`;
};

export const gqlGet = query => fetch(`/graphql?query=${encodeURIComponent(query)}`, { credentials: "include" }).then(resp => resp.json());
