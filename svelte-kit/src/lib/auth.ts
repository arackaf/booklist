import { betterAuth } from "better-auth";
import { createAuthMiddleware, customSession } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../data/dbUtils"; // your drizzle instance

import { env } from "$env/dynamic/private";
import { createFieldAttribute } from "better-auth/db";
import { account } from "$data/auth-schema";

const { GITHUB_AUTH_CLIENT_ID, GITHUB_AUTH_CLIENT_SECRET, GOOGLE_AUTH_CLIENT_ID, GOOGLE_AUTH_SECRET } = env;

export let auth: ReturnType<typeof betterAuth> = null as any;

export const initializeAuth = () => {
  auth = betterAuth({
    database: drizzleAdapter(db, { provider: "pg" }),
    socialProviders: {
      google: {
        clientId: GOOGLE_AUTH_CLIENT_ID,
        clientSecret: GOOGLE_AUTH_SECRET,
        redirectUri: "http://localhost:5173/auth/callback/google"
      }
    },
    // session: { additionalFields: { abc: createFieldAttribute("string") } },
    databaseHooks: {
      // session: {
      //   create: {
      //     before: async obj => {
      //       console.log("BEFORE SESSION CREATE", obj);
      //       obj.userId = obj.userId;
      //     }
      //   }
      // },
      account: {
        create: {
          before: async obj => {
            console.log("BEFORE ACCOUNT CREATE", obj);
          },
          after: async obj => {
            console.log("AFTER ACCOUNT CREATE", obj);
          }
        }
      }
    },
    // hooks: {
    //   after: createAuthMiddleware(async ctx => {
    //     console.log("\n\n");
    //     console.log("AFTER", ctx.path, ctx.context.newSession);
    //     console.log(ctx.path === "/sign-in/social");
    //     if (ctx.path === "/sign-in/social") {
    //       console.log("AFTER SIGN IN", ctx.context.newSession);
    //     }
    //     if (ctx.context.newSession) {
    //       console.log("newSession exists!!!!!", ctx.path);
    //       console.log(ctx.context.newSession);
    //       ctx.context.newSession.session.FOOOO = "BAR";
    //       ctx.context.newSession.user.FOOOO = "BAR";
    //       console.log(ctx.context.newSession);
    //     }
    //     if (ctx.path === "/sign-in/social" && ctx.context.session) {
    //       //ctx.context.session.FOOOO = "BAR";
    //       console.log("RETURNED", ctx.context.returned);
    //     }
    //     console.log("\n\n");
    //   })
    // }

    plugins: [
      customSession(async ({ session, user }) => {
        console.log("XXX", { session, user });
        return { user: { ...user, b: 808 }, session: { ...session, a: 99 } };
      })
    ]
  });
};
