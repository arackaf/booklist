import { getCookieLookup } from "./cookieHelpers";

export const BOOKS_CACHE = "books-cache";

export const getCachingHeaders = (name: string) => {
  const currentCacheValue = getCurrentCookieValue(name);

  return currentCacheValue
    ? {
        [name]: currentCacheValue
      }
    : {};
};

const getCurrentCookieValue = (name: string) => {
  const cookies = getCookieLookup();
  return cookies[name] ?? "";
};
