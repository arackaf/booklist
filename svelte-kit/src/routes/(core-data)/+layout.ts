export async function load({ data }: any) {
  const { loggedIn, isPublic } = data;
  const overrides: any = {};

  if (!loggedIn && !isPublic) {
    overrides.subjects = [];
    overrides.tags = [];
  }

  return {
    ...data,
    ...overrides
  };
}
