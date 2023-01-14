import { updateBook, updateBooksSubjects, updateBooksTags, updateBooksRead, deleteBook } from "$data/books";
import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";
import { ONE_YEAR_SECONDS } from "$lib/util/constants";
import { toJson } from "$lib/util/formDataHelpers";
import { BOOKS_VIEW_COOKIE } from "./bookViews/constants";

type Book = {
  _id: string;
  title: string;
  authors: string[];
};

export function load({ cookies }: any) {
  const booksCache = cookies.get(BOOKS_CACHE);

  return { booksCache };
}

export const actions = {
  async setBooksView({ request, cookies }: any) {
    const formData: URLSearchParams = await request.formData();

    cookies.set(BOOKS_VIEW_COOKIE, formData.get("view"), { maxAge: ONE_YEAR_SECONDS });
  },
  async reloadBooks({ cookies }: any) {
    updateCacheCookie(cookies, BOOKS_CACHE);
  },
  async saveBook({ request, cookies, locals }: any) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: URLSearchParams = await request.formData();

    const fields = toJson(formData, {
      strings: ["_id", "title"],
      arrays: ["authors", "tags", "subjects"]
    }) as Book;
    fields.authors = fields.authors.filter(a => a);

    await updateBook(session.userId, fields);

    updateCacheCookie(cookies, BOOKS_CACHE);

    return { success: true, updates: { fieldsSet: fields } };
  },
  async setBooksSubjects({ request, locals }: any) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: URLSearchParams = await request.formData();

    const fields = toJson(formData, {
      arrays: ["_ids", "add", "remove"]
    }) as any;

    await updateBooksSubjects(session.userId, fields);

    return { success: true };
  },
  async setBooksTags({ request, locals }: any) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: URLSearchParams = await request.formData();

    const fields = toJson(formData, {
      arrays: ["_ids", "add", "remove"]
    }) as any;

    await updateBooksTags(session.userId, fields);

    return { success: true };
  },
  async setBooksRead({ request, locals }: any) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: URLSearchParams = await request.formData();

    const fields = toJson(formData, {
      strings: ["read"],
      arrays: ["_ids"]
    }) as any;

    const setRead = fields.read === "true";
    await updateBooksRead(session.userId, fields._ids, fields.read === "true");

    return { success: true, updates: { fieldsSet: { isRead: setRead } } };
  },
  async deleteBook({ request, locals }: any) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: URLSearchParams = await request.formData();
    const _id = formData.get("_id")!;

    await deleteBook(session.userId, _id);

    return { success: true };
  }
};
