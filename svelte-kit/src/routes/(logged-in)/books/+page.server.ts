import { updateBook, updateBooksSubjects, updateBooksTags } from "$data/books";
import { BOOKS_CACHE, bustCache } from "$lib/state/cacheHelpers";
import { toJson } from "$lib/util/formDataHelpers";

type Book = {
  _id: string;
  title: string;
  authors: string[];
};

export const actions = {
  async saveBook({ request, cookies }: any) {
    const formData: URLSearchParams = await request.formData();

    const fields = toJson(formData, {
      strings: ["_id", "title"],
      arrays: ["authors", "tags", "subjects"]
    }) as Book;
    fields.authors = fields.authors.filter(a => a);

    await updateBook(fields);

    bustCache(cookies, BOOKS_CACHE);

    return { success: true, updates: { fieldsSet: fields } };
  },
  async setBooksSubjects({ request }: any) {
    const formData: URLSearchParams = await request.formData();

    const fields = toJson(formData, {
      arrays: ["_ids", "add", "remove"]
    }) as any;

    await updateBooksSubjects(fields._ids, fields.add, fields.remove);

    return { success: true };
  },
  async setBooksTags({ request }: any) {
    const formData: URLSearchParams = await request.formData();

    const fields = toJson(formData, {
      arrays: ["_ids", "add", "remove"]
    }) as any;

    await updateBooksTags(fields._ids, fields.add, fields.remove);

    return { success: true };
  }
};
