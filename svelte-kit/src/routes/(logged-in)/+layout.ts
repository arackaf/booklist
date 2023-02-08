export async function load({ data }: any) {
  const { loggedIn, isPublic } = data;
  const overrides: any = {};

  if (!loggedIn && !isPublic) {
    overrides.subjects = [];
    overrides.subjectHash = {};
    overrides.tags = [];
    overrides.tagHash = {};
  }

  return {
    ...data,
    ...overrides
  };
}
