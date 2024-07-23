"use client";

import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import * as z from "zod";
import { verifySchema } from "@/schema/verifySchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function VerifyAccount() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsVerifying(true);
    try {
      const response = await axios.post(`/api/verify-code`, {
        userName: params.username,
        code: data.code,
      });
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        router.replace("/sign-in");
      } else {
        toast({
          title: "Verification Failed",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Verification Failed",
        description:
          axiosError.response?.data.message ??
          "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-4/5 max-w-md p-6 space-y-4 bg-white rounded-lg shadow-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl mb-2">
            Verify Your Account
          </h1>
          <p className="mb-6">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyAccount;
