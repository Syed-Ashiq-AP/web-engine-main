"use server";

import { signIn } from "@/auth";

export const githubLogin = async () =>
  await signIn("github", { redirectTo: "/" });
