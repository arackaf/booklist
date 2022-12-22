import SvelteKitAuth from "@auth/sveltekit";
import GoogleProvider from "@auth/core/providers/google";
import { GOOGLE_AUTH_CLIENT_ID, GOOGLE_AUTH_SECRET } from "$env/static/private";

// const PRELOAD = new Set(["font", "js", "css"]);

// export async function handle({ event, resolve }: any) {
//   const response = await resolve(event, {
//     preload: ({ type }: any) => PRELOAD.has(type)
//   });

//   return response;
// }

export const handle = SvelteKitAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_AUTH_CLIENT_ID,
      clientSecret: GOOGLE_AUTH_SECRET
    })
  ]
});
