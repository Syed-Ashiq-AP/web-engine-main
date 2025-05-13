import type { NextAuthConfig } from "next-auth";

const NEXT_URL = process.env.NEXT_URL ?? "";

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
          const req = await fetch(`${NEXT_URL}/api/users/github`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          });
          if (req.ok) {
            const res = await req.json();
            console.log(res.message);
            if (res.success) {
              return true;
            }
            return false;
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
