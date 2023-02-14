import { redirect } from "@sveltejs/kit";
import { getPublicId } from "./getPublicId";

export const redirectToLanding = () => {
  throw redirect(302, "/landing");
};

export const ensureAnyUser = async ({ locals, parent, request, url }: any) => {
  const publicUserId = getPublicId(request || { url });
  if (publicUserId) {
    return {
      valid: true
    };
  }

  if (locals) {
    const session = await locals.getSession();

    if (!session?.userId) {
      redirectToLanding();
    }
  } else {
    const parentData = await parent();
    if (!parentData.loggedIn) {
      redirectToLanding();
    }
  }

  return {
    valid: true
  };
};

export const ensureLoggedIn = async ({ parent, locals }: any) => {
  if (locals) {
    const session = await locals.getSession();

    if (!session?.userId) {
      redirectToLanding();
    }
  } else {
    const parentData = await parent();
    if (!parentData.loggedIn) {
      redirectToLanding();
    }
  }

  return {
    valid: true
  };
};
