import User from "@/models/User";
import NextAuthOptions, { NextAuthConfig } from "next-auth";
import credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import connectMongoDB from "./lib/mongodb";
import { isPasswordValid } from "./lib/hash";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectMongoDB();
        const user = await User.findOne({
          email: credentials?.email,
        });

        if (!user) throw new Error("Wrong Email");

        const passwordMatch = await isPasswordValid(
          credentials!.password as string,
          user.password
        );

        if (!passwordMatch) throw new Error("Wrong Password");
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
});
