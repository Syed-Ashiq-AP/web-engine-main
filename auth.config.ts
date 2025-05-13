import type { NextAuthConfig } from "next-auth";
import { createUser, findOneUser } from "./queries/users";

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
    signOut: "/",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }
      if (account?.provider === "github") {
        try {
          if (!user.email || !user.name) return false;
          const userDocument = await findOneUser(user.email);
          if (!userDocument) {
            await createUser(user.name, user.email);
            return true;
          }
        } catch (error) {
          console.log(error);
          return false;
        }
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
