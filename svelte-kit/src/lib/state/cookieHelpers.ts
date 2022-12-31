export function getCookieLookup(): Record<string, string> {
  if (typeof document !== "object") {
    return {};
  }
  return document.cookie.split("; ").reduce((lookup, v) => {
    const parts = v.split("=");
    lookup[parts[0]] = parts[1];

    return lookup;
  }, {} as any);
}
