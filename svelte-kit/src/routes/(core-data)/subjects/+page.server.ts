import type { SubjectEditFields } from "$data/dbUtils";
import { saveSubject, deleteSubject } from "$data/subjects";
import { toJson } from "$lib/util/formDataHelpers";

export const actions = {
  async saveSubject({ request, locals }) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: FormData = await request.formData();

    const fields = toJson(formData, {
      strings: ["id", "name", "parentId", "path", "backgroundColor", "textColor", "originalParentId"]
    }) as SubjectEditFields & { id: string };

    await saveSubject(session.userId, fields.id, fields);
  },
  async deleteSubject({ request, locals }) {
    const session = await locals.getSession();
    if (!session) {
      return { success: false };
    }

    const formData: FormData = await request.formData();
    const id = parseInt(formData.get("id")!.toString());

    await deleteSubject(session.userId, id);
  }
};
