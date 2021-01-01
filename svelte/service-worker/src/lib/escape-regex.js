var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

export default function(str) {
  if (typeof str !== "string") {
    throw new TypeError("Expected a string");
  }

  return str.replace(matchOperatorsRe, "\\$&");
}
