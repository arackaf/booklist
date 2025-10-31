import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../data/dbUtils"; // your drizzle instance

import { env } from "$env/dynamic/private";
import { account } from "$data/auth-schema";
import { eq } from "drizzle-orm";

const { GITHUB_AUTH_CLIENT_ID, GITHUB_AUTH_CLIENT_SECRET, GOOGLE_AUTH_CLIENT_ID, GOOGLE_AUTH_SECRET, BETTER_AUTH_URL } = env;

export let auth: ReturnType<typeof betterAuth> = null as any;

export const initializeAuth = () => {
  auth = betterAuth({
    database: drizzleAdapter(db, { provider: "pg" }),
    socialProviders: {
      google: {
        clientId: GOOGLE_AUTH_CLIENT_ID,
        clientSecret: GOOGLE_AUTH_SECRET
      },
      github: {
        clientId: GITHUB_AUTH_CLIENT_ID,
        clientSecret: GITHUB_AUTH_CLIENT_SECRET
      }
    },
    baseURL: BETTER_AUTH_URL,
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // Update session every 1 day
      cookieCache: {
        enabled: true,
        maxAge: 60 * 60 * 24 * 120 // 5 minutes
      }
    }
  });
};

const providerIdMap = new Map<string, string>();

export const getProviderId = async (userId: string) => {
  if (providerIdMap.has(userId)) {
    return providerIdMap.get(userId)!;
  }

  const [user] = await db.select().from(account).where(eq(account.userId, userId));

  const providerId = user!.accountId;
  providerIdMap.set(userId, providerId);

  if (!providerId) {
    throw new Error("Provider ID not found");
  }
  return providerId;
};
