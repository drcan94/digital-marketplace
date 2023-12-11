"use client";

import { Icons } from "@/components/Icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "@/lib/validators/account-credentials-validator";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isSeller = searchParams.get("as") === "seller";
  const origin = searchParams.get("origin");

  const continueAsSeller = () => {
    router.push(`?as=seller`);
  };

  const continueAsBuyer = () => {
    router.replace("/sign-in", undefined);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  useEffect(() => {
    if (errors.email) {
      toast.error(errors?.email.message);
    }
    if (errors.password) {
      toast.error(errors?.password.message);
    }
  }, [errors]);

  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error(`Invalid email or password.`);
        return;
      }
      if (error instanceof ZodError) {
        console.log(error.issues);
        toast.error(error.issues[0].message);
        return;
      }
      toast.error("An unknown error occurred. Please try again later.");
    },
    onSuccess: () => {
      toast.success(
        `Welcome back! You're redirecting to ${
          isSeller ? "seller page" : origin ? "origin page" : "home page"
        }.`
      );
      router.refresh();
      if (origin) {
        router.push(`/${origin}`);
        return;
      }

      if (isSeller) {
        router.push(`/sell`);
        return;
      }
      router.push(`/`);
    },
  });

  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    signIn({ email, password });
  };

  return (
    <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.logo className="h-20 w-20" />
          <h1 className="text-2xl font-semibold">
            Sign in to your {isSeller && "seller"} account
          </h1>
          <Link
            href="/sign-up"
            className={buttonVariants({
              variant: "link",
              className: "gap-1.5",
            })}
          >
            Don&apos;t have an account? Sign up
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-1 py-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  {...register("email")}
                  className={cn("mt-1", {
                    "focus-visible:ring-red-500": errors.email,
                  })}
                  placeholder="E-mail address"
                />
                {errors?.email && (
                  <p className="text-xs text-red-600 ml-0.5">
                    {errors?.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-1 py-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  {...register("password")}
                  className={cn("mt-1", {
                    "focus-visible:ring-red-500": errors.password,
                  })}
                  placeholder="Password"
                />
                {errors?.password && (
                  <p className="text-xs text-red-600 ml-0.5">
                    {errors?.password.message}
                  </p>
                )}
              </div>
              <Button type="submit">
                Sign In{" "}
                {isLoading && (
                  <Loader2 className="animate-spin h-8 w-8 text-zinc-300"></Loader2>
                )}
              </Button>
            </div>
          </form>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center"
            >
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          {isSeller ? (
            <Button
              onClick={continueAsBuyer}
              variant={"secondary"}
              disabled={isLoading}
            >
              Continue as customer
            </Button>
          ) : (
            <Button
              onClick={continueAsSeller}
              variant={"secondary"}
              disabled={isLoading}
            >
              Continue as seller
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
