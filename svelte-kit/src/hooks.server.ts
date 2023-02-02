import { sequence } from "@sveltejs/kit/hooks";
import { SvelteKitAuth } from "@auth/sveltekit";
import GoogleProvider from "@auth/core/providers/google";
import { GOOGLE_AUTH_CLIENT_ID, GOOGLE_AUTH_SECRET, NEXTAUTH_SECRET } from "$env/static/private";

import { getUserSync } from "$data/legacyUser";
// force deploy
const auth = SvelteKitAuth({
  providers: [
    // @ts-ignore
    GoogleProvider({
      clientId: GOOGLE_AUTH_CLIENT_ID,
      clientSecret: GOOGLE_AUTH_SECRET
    })
  ],
  session: {
    maxAge: 60 * 60 * 24 * 365,
    strategy: "jwt"
  },

  trustHost: true,
  secret: "secret-xxx",

  callbacks: {
    async signIn({ account }) {
      console.log("Sign in callback");
      if (account == null) {
        return false;
      }

      console.log({ "account.providerAccountId": account.providerAccountId });
      setTimeout(() => {
        console.log({ "account.providerAccountId": account.providerAccountId });
      }, 3000);
      const userSync = await getUserSync(account.providerAccountId);

      setTimeout(() => {
        console.log("userSync", userSync);
      }, 3000);

      if (userSync) {
        account.syncdId = userSync.sk;
      }

      return true;
    },
    async jwt({ token, account }) {
      token.userId ??= account?.syncdId || account?.providerAccountId;
      if (account?.syncdId) {
        token.legacySync = true;
      }
      return token;
    },
    async session({ session, user, token }) {
      (session as any).userId = token.userId;
      if ((token as any).legacySync) {
        (session as any).legacySync = true;
      }
      return session;
    }
  }
});

const PRELOAD = new Set(["font", "js", "css"]);

async function handleFn({ event, resolve }: any) {
  //const initialRequest = event.request.headers.get("Sec-Fetch-Dest") === "document";

  //console.log("Sec-Fetch-Dest", event.request.headers.get("Sec-Fetch-Dest"));
  //const xxx = event.request.headers.get("Referer");
  //console.log(!!xxx, xxx);

  const response = await resolve(event, {
    preload: ({ type }: any) => PRELOAD.has(type)
  });

  return response;
}

export const handle = sequence(handleFn, auth);
