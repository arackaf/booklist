import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";

const dynamoConfig: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
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

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_SECRET
    })
  ],

  session: {
    maxAge: 60 * 60 * 24 * 365,
    strategy: "jwt"
  },

  secret: process.env.NEXTAUTH_SECRET,

  adapter: DynamoDBAdapter(client, { tableName: process.env.DYNAMO_AUTH_TABLE }),

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signin", { user, account, profile });
      (user as any).providerId = account.providerAccountId;
      return true;
    },
    async session(props) {
      const { session, user, token } = props;

      (session as any).ppp = "ui";
      (session.user as any).q = "pop";

      console.log("\n\nauth", props);
      //session.userId = user.id;
      //session.abc = "abc";
      return session;
    }
  }
};

export default NextAuth(authOptions);
