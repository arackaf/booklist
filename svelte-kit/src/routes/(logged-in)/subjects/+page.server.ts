import { updateSubject } from "$data/subjects";
import type { SubjectWithParentId } from "$data/types";
import { toJson } from "$lib/util/formDataHelpers";

export const actions = {
  async saveSubject({ request, cookies, locals }: any) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: URLSearchParams = await request.formData();

    const fields = toJson(formData, {
      strings: ["_id", "name", "parentId", "backgroundColor", "textColor"],
      arrays: ["authors", "tags", "subjects"]
    }) as SubjectWithParentId;

    await updateSubject(session.userId, fields);
  }
};
