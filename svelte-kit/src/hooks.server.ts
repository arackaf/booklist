import { sequence } from "@sveltejs/kit/hooks";
import { SvelteKitAuth } from "@auth/sveltekit";
import GoogleProvider from "@auth/core/providers/google";
import GithubProvider from "@auth/core/providers/github";

import { auth, getProviderId, initializeAuth } from "$lib/auth"; // path to your auth file
import { svelteKitHandler } from "better-auth/svelte-kit";

import { env } from "$env/dynamic/private";
import { building } from "$app/environment";

const {
  BOOKLIST_DYNAMO,
  GITHUB_AUTH_CLIENT_ID,
  GITHUB_AUTH_CLIENT_SECRET,
  GOOGLE_AUTH_CLIENT_ID,
  GOOGLE_AUTH_SECRET,
  AMAZON_ACCESS_KEY,
  AMAZON_SECRET_KEY,
  DYNAMO_AUTH_TABLE,
  AUTH_SECRET
} = env;

import { DynamoDB, type DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";
import { initializePostgres } from "$data/dbUtils";
import { initializeDynamo } from "$data/dynamoHelpers";

initializePostgres({
  useMockDb: building,
  connectionString: env.FLY_DB
});
initializeDynamo({
  tableName: BOOKLIST_DYNAMO,
  authTableName: DYNAMO_AUTH_TABLE,
  accessKey: AMAZON_ACCESS_KEY,
  secretKey: AMAZON_SECRET_KEY
});
initializeAuth();

const dynamoConfig: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: AMAZON_ACCESS_KEY,
    secretAccessKey: AMAZON_SECRET_KEY
  },

  region: "us-east-1"
};

const client = DynamoDBDocument.from(new DynamoDB(dynamoConfig), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true
  }
});

const old_auth = SvelteKitAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_AUTH_CLIENT_ID,
      clientSecret: GOOGLE_AUTH_SECRET
    }),
    GithubProvider({
      clientId: GITHUB_AUTH_CLIENT_ID,
      clientSecret: GITHUB_AUTH_CLIENT_SECRET
    })
  ],
  session: {
    maxAge: 60 * 60 * 24 * 365,
    strategy: "jwt"
  },

  trustHost: true,
  secret: AUTH_SECRET,

  adapter: DynamoDBAdapter(client, { tableName: DYNAMO_AUTH_TABLE }),

  callbacks: {
    async signIn({ account }) {
      if (account == null) {
        return false;
      }

      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.ver = "2";
      }
      token.userId ??= account?.syncdId || account?.providerAccountId;
      if (account?.provider) {
        token.provider = account?.provider;
      }

      return token;
    },
    async session({ session, token }: any) {
      session.userId = token.userId as string;
      if (token.provider) {
        session.provider = token.provider as string;
      }
      session.ver = token.ver;

      return session;
    }
  }
});

const PRELOAD = new Set(["font", "js", "css"]);

export async function handle({ event, resolve }: any) {
  if (event.url.pathname.includes("/.well-known/appspecific/com.chrome.devtools")) {
    return new Response(null, { status: 204 }); // Return empty response with 204 No Content
  }

  const sessionPayload = await auth.api.getSession({
    headers: event.request.headers
  });

  if (sessionPayload && sessionPayload.session) {
    const providerId = await getProviderId(sessionPayload.session.userId);
    (sessionPayload as any).userId = providerId;
    sessionPayload.session.userId = providerId;
  }
  event.locals.getSession = () => sessionPayload;

  return svelteKitHandler({ event, resolve, auth, building });
}
