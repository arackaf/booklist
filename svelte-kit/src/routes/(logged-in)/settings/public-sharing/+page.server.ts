import { createUser, getUser } from "$data/user";

export const load = async ({ locals }: any) => {
  const session = await locals.getSession();
  const { userId } = session;

  if (!userId) {
    return {};
  }

  let user = await getUser(userId);

  if (!user) {
    await createUser(userId);
  }
  user = await getUser(userId);

  console.log({ user });

  return {
    user
  };
};

export const actions = {
  async updateSettings({ request, locals }: any) {}
};
