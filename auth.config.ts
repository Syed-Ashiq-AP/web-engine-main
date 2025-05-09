import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/",
    signIn: "/",
    signOut: "/",
  },
  callbacks: {
    authorized({ auth }) {
      const isAuthenticated = !!auth?.user;

      return isAuthenticated;
    },
    async session({ session, token }) {
      session.user._id = token.id as string;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); // Attach MongoDB _id to the token
      }
      return token;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
