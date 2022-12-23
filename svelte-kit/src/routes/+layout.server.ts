export async function load({ parent, locals }: any) {
  const session = await locals.getSession();
  const loggedIn = !!session?.user;

  return {
    loggedIn
  };
}
