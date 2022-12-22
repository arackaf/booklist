import SvelteKitAuth from "@auth/sveltekit";
import GoogleProvider from "@auth/core/providers/google";
import { GOOGLE_AUTH_CLIENT_ID, GOOGLE_AUTH_SECRET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, DYNAMO_AUTH_TABLE } from "$env/static/private";

import { DynamoDB, type DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";

const dynamoConfig: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
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

export const handle = SvelteKitAuth({
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

  secret: process.env.NEXTAUTH_SECRET,

  adapter: DynamoDBAdapter(client, { tableName: DYNAMO_AUTH_TABLE }) as any
});

// const PRELOAD = new Set(["font", "js", "css"]);

// export async function handle({ event, resolve }: any) {
//   const response = await resolve(event, {
//     preload: ({ type }: any) => PRELOAD.has(type)
//   });

//   return response;
// }
