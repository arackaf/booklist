import { redirect } from "@sveltejs/kit";

export const redirectToLanding = () => {
  throw redirect(302, "/landing");
};
