"use client";

import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { messageSchema } from "@/schema/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { useCompletion } from "ai/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Page() {
  const params = useParams();
  const userName = params.username;
  const [isSending, setIsSending] = useState(false);
  const [isSuggestLoading, setIsSuggestingLoading] = useState(false);
  const [messages, setMessages] = useState([
    "Do you have any pets?",
    "What is your dream job?",
    "What is your favorite movie?",
  ]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const messageContent = form.watch("content");

  //Message suggetion througn OPENAI_API_KEY
  //   const specialChar = "||";

  //   const parseStringMessages = (messageString: string): string[] => {
  //     return messageString.split(specialChar);
  //   };

  //   const initialMessageString =
  //     "What's your favorite movie?||Do you have any pets?||What's your dream job?";

  //   const {
  //     complete,
  //     completion,
  //     isLoading: isSuggestLoading,
  //     error,
  //   } = useCompletion({
  //     api: "/api/suggest-message",
  //     initialCompletion: initialMessageString,
  //   });
  //   const [isLoading, setIsLoading] = useState(false);
  //   const fetchSuggestedMessages = async () => {
  //     try {
  //       complete("");
  //     } catch (error) {
  //       console.error("Error fetching messages:", error);
  //     }
  //   };

  //=====================================================================================

  //Message suggestion throgh some dummy messages in array

  const fetchSuggestedMessages = async () => {
    try {
      setIsSuggestingLoading(true);
      const response = await axios.get("/api/suggest-message");
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSuggestingLoading(false);
    }
  };

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSending(true);
    try {
      const response = await axios.post("/api/send-message", {
        userName,
        content: data.content,
      });
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        form.reset();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto my-4 p-4 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send message anonymously to @{userName}</FormLabel>
                <Input
                  type="text"
                  {...field}
                  placeholder="Write some text here to send!"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isSending ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isSending}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </FormProvider>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          {/* <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button> */}
          {isSuggestLoading ? (
            <Button disabled className="my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Suggesting...
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSuggestLoading}
              className="my-4"
              onClick={fetchSuggestedMessages}
            >
              Suggest Messages
            </Button>
          )}
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {/* Message suggetion througn OPENAI_API_KEY */}
            {/* {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )} */}
            {/* Message suggestion throgh some dummy messages in array */}
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            ) : (
              <p>Nothing to suggest</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}

export default Page;
