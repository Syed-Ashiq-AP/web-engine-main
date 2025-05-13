import type { Account, NextAuthConfig, User as AuthUser } from "next-auth";
import User from "./models/User";
import { signIn } from "next-auth/react";
import connectMongoDB from "./lib/mongodb";
import { createUser } from "./queries/users";

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
          await connectMongoDB();
          const userDocument = await User.findOne({ email: user.email });
          if (!userDocument) {
            await User.create({
              name: user.name,
              email: user.email,
            });
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
