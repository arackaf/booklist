import { auth } from "$lib/auth";

export const load = async ({ request }) => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    console.log({ session });
  } catch (er) {
    console.log({ er });
  }
  console.log("LOADER");
};
