"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { githubLogin } from "@/lib/actions/auth";
import { Github } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const texts = {
  "/register": {
    h3: "Create an Account",
    span: "Start building your dreams.",
    lastSpan: "Already have an account",
    link: "/login",
    linkText: "Login",
  },
  "/login": {
    h3: "Log in to you Account",
    span: "Welcome back! Please enter your details.",
    lastSpan: "Don't have an account",
    link: "/register",
    linkText: "Sign up",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname() as "/login" | "/register";
  return (
    <div className="w-dvw h-dvh flex flex-col gap-4 items-center justify-center">
      <h3 className="font-medium">{texts[pathname].h3}</h3>
      <span className=" text-muted-foreground">{texts[pathname].span}</span>
      <div className="flex flex-col gap-4 items-stretch w-full p-10 lg:w-96">
        {children}
        <div className="flex items-center gap-2 w-full">
          <Separator className=" flex-1/2" />
          <span className="text-muted-foreground">OR</span>
          <Separator className=" flex-1/2" />
        </div>
        <Button onClick={githubLogin} disabled>
          <Github />
          Github
        </Button>
      </div>
      <div className="flex gap-2 ">
        <span className="text-muted-foreground">
          {texts[pathname].lastSpan}?
        </span>
        <Link
          href={texts[pathname].link}
          className="text-neutral-200 font-medium"
        >
          {texts[pathname].linkText}
        </Link>
      </div>
    </div>
  );
}
