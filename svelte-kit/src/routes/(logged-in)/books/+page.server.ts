import { updateBook, updateBooksSubjects, updateBooksTags } from "$data/books";
import { BOOKS_CACHE, bustCache } from "$lib/state/cacheHelpers";
import { toJson } from "$lib/util/formDataHelpers";

type Book = {
  _id: string;
  title: string;
  authors: string[];
};

export async function load({ depends, isDataRequest, cookies }: any) {
  depends("reload-books");

  if (isDataRequest) {
    bustCache(cookies, BOOKS_CACHE);
  }

  return {};
}

export const actions = {
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

    bustCache(cookies, BOOKS_CACHE);

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
  }
};
