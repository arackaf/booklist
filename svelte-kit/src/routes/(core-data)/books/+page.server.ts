import { updateBook, updateBooksSubjects, updateBooksTags, updateBooksRead, deleteBook, insertBook } from "$data/books";
import type { Book, Tag } from "$data/types";
import { saveTag, deleteSingleTag } from "$data/tags";

import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";
import { removeEmpty, toJson } from "$lib/util/formDataHelpers";
import { updateUxState } from "$lib/util/uxState";

export const actions = {
  async setBooksView({ request, cookies }) {
    const formData: FormData = await request.formData();

    const view = formData.get("view") as string;
    updateUxState(cookies, { bkVw: view });
  },
  async reloadBooks({ cookies }) {
    updateCacheCookie(cookies, BOOKS_CACHE);
  },
  async saveBook({ request, cookies, locals }) {
    const session = await locals.getSession();

    if (!session) {
      return { success: false };
    }

    const formData: FormData = await request.formData();

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
  async saveBookCovers({ request, cookies, locals }) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: FormData = await request.formData();

    const fields: Partial<Book> = removeEmpty(
      toJson(formData, {
        strings: ["id", "mobileImage", "mobileImagePreview", "smallImage", "smallImagePreview", "mediumImage", "mediumImagePreview"]
      })
    );

    await updateBook(session.userId, fields);
    updateCacheCookie(cookies, BOOKS_CACHE);

    return { success: true, updates: { fieldsSet: fields } };
  },
  async setBooksSubjectsTags({ request, cookies, locals }) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: FormData = await request.formData();

    const fields = toJson(formData, {
      arrays: ["ids", "subjects-add", "subjects-remove", "tags-add", "tags-remove"]
    }) as any;

    await Promise.all([
      updateBooksSubjects(session.userId, { ...fields, add: fields["subjects-add"], remove: fields["subjects-remove"] }),
      updateBooksTags(session.userId, { ...fields, add: fields["tags-add"], remove: fields["tags-remove"] })
    ]);
    updateCacheCookie(cookies, BOOKS_CACHE);

    return { success: true };
  },
  async setBooksRead({ request, cookies, locals }) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: FormData = await request.formData();

    const fields = toJson(formData, {
      strings: ["read"],
      numberArrays: ["ids"]
    }) as any;

    const setRead = fields.read === "true";
    await updateBooksRead(session.userId, fields.ids, fields.read === "true");
    updateCacheCookie(cookies, BOOKS_CACHE);

    return { success: true, updates: { fieldsSet: { isRead: setRead } } };
  },
  async deleteBook({ request, cookies, locals }) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: FormData = await request.formData();
    const id = parseInt(formData.get("id")!.toString());

    await deleteBook(session.userId, id);
    updateCacheCookie(cookies, BOOKS_CACHE);

    return { success: true };
  },
  async saveTag({ request, locals }) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: FormData = await request.formData();

    const fields = toJson(formData, {
      numbers: ["id"],
      strings: ["name", "backgroundColor", "textColor"]
    }) as Tag;

    await saveTag(session.userId, fields.id, fields);
  },
  async deleteTag({ request, locals }) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: FormData = await request.formData();
    const id = formData.get("id")!;

    await deleteSingleTag(session.userId, parseInt(id.toString()));
  }
};
