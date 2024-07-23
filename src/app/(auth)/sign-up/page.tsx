"use client";

import { useToast } from "@/components/ui/use-toast";
import { signUpSchema } from "@/schema/signUpSchema";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";

function SignOutPage() {
  const [userName, setUserName] = useState("");
  const [userNameMessage, setUserNameMessage] = useState("");
  const [isCheckingUserName, setIsCheckingUserName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounceUsername = useDebounceCallback(setUserName, 500);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUniqueUsername = async () => {
      if (userName) {
        setIsCheckingUserName(true);
        setUserNameMessage("");
        try {
          const { data } = await axios.get(
            `/api/check-unique-username?username=${userName}`
          );
          setUserNameMessage(data.message);
        } catch (error) {
          //  console.log(error);
          const axiosError = error as AxiosError<ApiResponse>;
          setUserNameMessage(
            axiosError.response?.data.message ?? "Error in checking username"
          );
        } finally {
          setIsCheckingUserName(false);
        }
      }
    };
    checkUniqueUsername();
  }, [userName]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      if (response.data.success) {
        router.replace(`/verify/${userName}`);
        toast({
          title: "Success",
          description: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error during sign-up:", error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ("There was a problem with your sign-up. Please try again.");

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-4/5 max-w-md p-6 space-y-4 bg-white rounded-lg shadow-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl mb-1">
            Join SecretSend
          </h1>
          <p className="mb-6">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="userName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>

                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounceUsername(e.target.value);
                    }}
                  />
                  {isCheckingUserName && <Loader2 className="animate-spin" />}
                  {!isCheckingUserName && userNameMessage && (
                    <p
                      className={`text-sm ${
                        userNameMessage === "Username is unique"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {userNameMessage}
                    </p>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className="text-muted text-slate-300 text-sm font-light">
                    We will send you a verification code
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignOutPage;
