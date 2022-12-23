import { lookupUser } from "$data/legacyUser";
import { toJson } from "$lib/util/formDataHelpers";

export const actions = {
  async attemptSync({ request }: any) {
    const formData: URLSearchParams = await request.formData();

    const fields = toJson(formData, {
      strings: ["email", "password"]
    }) as { email: string; password: string };

    console.log({ fields });
    const { email, password } = fields;

    const result = await lookupUser(email, password);

    return { success: true, result };
  }
};
