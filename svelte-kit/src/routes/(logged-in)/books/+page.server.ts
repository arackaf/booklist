import { updateBook, updateBooksSubjects, updateBooksTags, updateBooksRead, deleteBook } from "$data/books";
import type { Tag } from "$data/types";
import { saveTag, deleteSingleTag } from "$data/tags";

import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";
import { removeEmpty, toJson } from "$lib/util/formDataHelpers";
import { updateUxState } from "$lib/util/uxState";

type Book = {
  _id: string;
  title: string;
  authors: string[];
};

export const actions = {
  async setBooksView({ request, cookies }: any) {
    const formData: URLSearchParams = await request.formData();

    const view = formData.get("view");
    updateUxState(cookies, { bkVw: view });
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
      strings: ["_id", "title", "isbn", "publisher", "publicationDate"],
      numbers: ["pages"],
      arrays: ["authors", "tags", "subjects"]
    }) as Book;
    fields.authors = fields.authors.filter(a => a);

    await updateBook(session.userId, fields);

    updateCacheCookie(cookies, BOOKS_CACHE);

    return { success: true, updates: { fieldsSet: fields } };
  },
  async saveBookCovers({ request, cookies, locals }: any) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: URLSearchParams = await request.formData();

    const fields: Partial<Book> = removeEmpty(
      toJson(formData, {
        strings: ["_id", "mobileImage", "mobileImagePreview", "smallImage", "smallImagePreview", "mediumImage", "mediumImagePreview"]
      })
    );

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
  },
  async saveTag({ request, locals }: any) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: URLSearchParams = await request.formData();

    const fields = toJson(formData, {
      strings: ["_id", "name", "backgroundColor", "textColor"]
    }) as Tag;

    await saveTag(session.userId, fields._id, fields);
  },
  async deleteTag({ request, locals }: any) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: URLSearchParams = await request.formData();
    const _id = formData.get("_id")!;

    await deleteSingleTag(session.userId, _id);
  }
};
