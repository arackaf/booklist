import { getCookieLookup } from "./cookieHelpers";

export const BOOKS_CACHE = "books-cache";

export const getBooksCacheCookie = () => getCurrentCookieValue(BOOKS_CACHE);

const getCurrentCookieValue = (name: string) => {
  const cookies = getCookieLookup();
  return cookies[name] ?? "";
};
