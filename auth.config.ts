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
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id.toString();
      }
      return token;
    },
    async session({ session, token }) {
      session.user._id = token._id as string;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
