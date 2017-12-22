export const args = (...args) => args.filter(s => s).join("\n");

export const strArg = (name, value, emptyVal = "") => {
  if (value == null || value === emptyVal) return "";

  return `${name}:"${value}"`;
};

export const numArg = (name, value, emptyVal = "") => {
  if (value == null || value === emptyVal || isNaN(value)) return "";

  return `${name}:${value}`;
};

export const boolArg = (name, value, emptyVal = "") => {
  if (value == null || value === emptyVal) return "";

  return `${name}:${value ? true : false}`;
};

export const strArrArg = (name, values, sendEmpty = false) => {
  if (values == null || (!sendEmpty && !values.length)) return "";

  return `${name}:${JSON.stringify(values)}`;
};
