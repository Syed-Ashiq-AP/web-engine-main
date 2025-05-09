"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(4),
});
export default function Home() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const req = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (req.ok) {
        const res = await req.json();
        if (res.success) {
          router.push("/login");
        } else {
          form.setError("root", {
            type: "manual",
            message: res.message,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const { errors } = form.formState;

  const [showPassword, setShowPassword] = useState<"password" | "text">(
    "password"
  );

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="rounded-lg border">
                    <Input
                      className=" border-none dark:bg-transparent focus-visible:ring-0"
                      placeholder="Enter your Name"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="rounded-lg border">
                    <Input
                      type="email"
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
          <Button className="w-full" type="submit">
            Get started
          </Button>
        </form>
      </Form>
    </>
  );
}
