import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../data/dbUtils"; // your drizzle instance

import { env } from "$env/dynamic/private";

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
    }
  });
};
