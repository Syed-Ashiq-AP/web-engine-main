"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});
export default function Home() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { errors } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await signIn("credentials", { ...values, redirect: false });
      if (res.error) {
        form.setError("root", {
          type: "manual",
          message: "Invalid Email or Password",
        });
      } else {
        router.replace("/");
      }
    } catch (e) {
      console.log(e);
    }
  }

  const [showPassword, setShowPassword] = useState<"password" | "text">(
    "password"
  );

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="rounded-lg border">
                    <Input
                      className=" border-none dark:bg-transparent focus-visible:ring-0"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="flex gap-3 items-center rounded-lg border">
                    <Input
                      className=" border-none dark:bg-transparent focus-visible:ring-0"
                      type={showPassword}
                      placeholder="Enter your password"
                      {...field}
                    />
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword(
                          showPassword === "password" ? "text" : "password"
                        )
                      }
                    >
                      {showPassword === "password" ? <Eye /> : <EyeClosed />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors.root && (
            <span className=" text-sm block my-2 text-destructive">
              {errors.root.message}
            </span>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember">Remember for 30 days</Label>
          </div>
          <Button className="w-full" type="submit">
            Sign in
          </Button>
        </form>
      </Form>
    </>
  );
}
