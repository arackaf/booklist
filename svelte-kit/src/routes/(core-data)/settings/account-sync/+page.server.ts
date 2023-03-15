import { lookupUser, syncUser } from "$data/legacyUser";
import { ensureLoggedIn } from "$lib/util/authCheck";

import { toJson } from "$lib/util/formDataHelpers";

export const load = async ({ locals }) => {
  await ensureLoggedIn({ locals });

  const session = await locals.getSession();

  const { legacySync } = session!;

  return {
    legacySync
  };
};

export const actions = {
  async attemptSync({ request, locals }: any) {
    try {
      const session = await locals.getSession();
      const { userId } = session;

      const formData: URLSearchParams = await request.formData();

      const fields = toJson(formData, {
        strings: ["email", "password"]
      }) as { email: string; password: string };

      const { email, password } = fields;

      const result = await lookupUser(email, password);

      if (result == null || !result.id) {
        return { success: false, error: false };
      }

      if (result.id) {
        await syncUser(userId, result.id);
      }

      return { success: true, result };
    } catch (er) {
      console.log(er);
      return { success: false, error: true };
    }
  }
};
