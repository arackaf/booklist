import { sequence } from "@sveltejs/kit/hooks";
import { SvelteKitAuth } from "@auth/sveltekit";
import GoogleProvider from "@auth/core/providers/google";
import { GOOGLE_AUTH_CLIENT_ID, GOOGLE_AUTH_SECRET, AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, DYNAMO_AUTH_TABLE, AUTH_SECRET } from "$env/static/private";

import { DynamoDB, type DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";
import { getUserSync } from "$data/legacyUser";

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

const auth = SvelteKitAuth({
  providers: [
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
  secret: AUTH_SECRET,

  adapter: DynamoDBAdapter(client, { tableName: DYNAMO_AUTH_TABLE }) as any,

  callbacks: {
    async signIn({ account }) {
      if (account == null) {
        return false;
      }

      const userSync = await getUserSync(account.providerAccountId);

      if (userSync) {
        account.syncdId = userSync;
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
    async session({ session, token }) {
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
  const response = await resolve(event, {
    preload: ({ type }: any) => PRELOAD.has(type)
  });

  return response;
}

async function deployedAuthOverride({ event, resolve }: any) {
  const { url } = event;

  if (url.hostname.indexOf(".vercel.app") !== -1) {
    event.locals.getSession = () => ({
      user: {},
      userId: "test-user1"
    });
  }

  return resolve(event);
}
export const handle = sequence(handleFn, auth, deployedAuthOverride);
