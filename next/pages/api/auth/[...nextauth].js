import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_SECRET
    })
  ],

  secret: process.env.NEXTAUTH_SECRET,

  // async jwt({ token, account }) {
  //   // Persist the OAuth access_token to the token right after signin
  //   console.log({ token, account });
  //   return token;
  // },

  callbacks: {
    async session({ session, user, token }) {
      console.log("SESSION", { session, user, token }, "\n-------\n");
      session.userId = token.sub;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("JWT", { token, user, account, profile, isNewUser }, "\n-------\n");
      return token;
    }
  }

  // session: {
  //   strategy:
  // }

  // async session({ session, token, user }) {
  //   console.log({ session, token, user });
  //   return session;
  // }
};

export default NextAuth(authOptions);
