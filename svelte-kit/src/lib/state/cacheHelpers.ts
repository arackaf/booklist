import { ONE_YEAR_SECONDS } from "$lib/util/constants";
import { getCookieLookup } from "./cookieHelpers";

export const BOOKS_CACHE = "books-cache";

export const updateCacheCookie = (cookies: any, name: string, value = +new Date()) => {
  cookies.set(name, value, { path: "/", maxAge: ONE_YEAR_SECONDS, httpOnly: false });
};

export const getCurrentCookieValue = (name: string) => {
  const cookies = getCookieLookup();
  return cookies[name] ?? "";
};
