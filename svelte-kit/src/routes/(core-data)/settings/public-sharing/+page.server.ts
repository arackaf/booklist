import { createUser, getUser, updateUser } from "$data/user";
import { ensureLoggedIn } from "$lib/util/authCheck";
import { toJson } from "$lib/util/formDataHelpers";

export const load = async ({ locals, depends, url }: any) => {
  depends("user:settings");

  await ensureLoggedIn({ locals });

  const session = (await locals.getSession())!;
  const { userId } = session;

  let user = await getUser(userId);

  if (!user) {
    await createUser(userId);
  }
  user = await getUser(userId, true);
  const isPublic = user?.isPublic ?? false;
  const publicLink = isPublic ? `${url.protocol}//${url.host}/books?user=${userId}` : "";

  return {
    user,
    isPublic,
    publicLink
  };
};

type UserSettingsPacket = {
  isPublic: string;
  publicName: string;
  publicBooksHeader: string;
};

export const actions = {
  async updateSettings({ request, locals }) {
    const session = (await locals.getSession())!;
    const { userId } = session;

    if (!userId) {
      return {};
    }

    const formData: FormData = await request.formData();

    const values = toJson(formData as any, {
      strings: ["isPublic", "publicName", "publicBooksHeader"]
    }) as UserSettingsPacket;

    const isPublic = !!values.isPublic;
    const publicName = !isPublic ? "" : values.publicName;
    const publicBooksHeader = !isPublic ? "" : values.publicBooksHeader;

    await updateUser(userId, isPublic, publicName, publicBooksHeader);
  }
};
