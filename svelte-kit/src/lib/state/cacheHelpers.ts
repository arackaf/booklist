import { getCookieLookup } from "./cookieHelpers";

export const BOOKS_CACHE = "books-cache";

export const bustCache = (cookies: any, name: string) => {
  cookies.set(name, +new Date(), { path: "/", httpOnly: false });
};

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
