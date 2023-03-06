import { updateBook, updateBooksSubjects, updateBooksTags, updateBooksRead, deleteBook, insertBook } from "$data/books";
import type { Book, Tag } from "$data/types";
import { saveTag, deleteSingleTag } from "$data/tags";

import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";
import { removeEmpty, toJson } from "$lib/util/formDataHelpers";
import { updateUxState } from "$lib/util/uxState";

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
      strings: ["title", "isbn", "publisher", "publicationDate"],
      numbers: ["id", "pages"],
      optionals: ["mobileImage", "smallImage", "mediumImage"],
      optionalObjects: ["mobileImagePreview", "smallImagePreview", "mediumImagePreview"],
      arrays: ["authors"],
      numberArrays: ["tags", "subjects"]
    }) as unknown as Book;
    fields.authors = fields.authors.filter(a => a);

    if (fields.id) {
      await updateBook(session.userId, fields);
    } else {
      await insertBook(session.userId, fields);
    }

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
        strings: ["id", "mobileImage", "mobileImagePreview", "smallImage", "smallImagePreview", "mediumImage", "mediumImagePreview"]
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
      arrays: ["ids", "add", "remove"]
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
      arrays: ["ids", "add", "remove"]
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
      numberArrays: ["ids"]
    }) as any;

    const setRead = fields.read === "true";
    await updateBooksRead(session.userId, fields.ids, fields.read === "true");

    return { success: true, updates: { fieldsSet: { isRead: setRead } } };
  },
  async deleteBook({ request, locals }: any) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: URLSearchParams = await request.formData();
    const id = parseInt(formData.get("id")!);

    await deleteBook(session.userId, id);

    return { success: true };
  },
  async saveTag({ request, locals }: any) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: URLSearchParams = await request.formData();

    const fields = toJson(formData, {
      strings: ["id", "name", "backgroundColor", "textColor"]
    }) as Tag;

    await saveTag(session.userId, fields.id, fields);
  },
  async deleteTag({ request, locals }: any) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: URLSearchParams = await request.formData();
    const id = formData.get("id")!;

    await deleteSingleTag(session.userId, id);
  }
};
