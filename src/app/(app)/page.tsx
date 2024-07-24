"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/Data/messages.json";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Mail } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { User } from "@/models/User";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Home() {
  const [users, setUsers] = React.useState<User[]>([]);
  const { toast } = useToast();

  const getAllUser = async () => {
    try {
      const response = await axios.get(`/api/get-all-user`);
      if (response.data.success) {
        setUsers(response.data.user);
      //   toast({
      //     title: "Success",
      //     description: response.data.message,
      //   });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "User Fetching failed",
        description: axiosError.response?.data.message ?? "An error occurred.",
        variant: "destructive",
      });
    }
  };
  React.useEffect(() => {
    getAllUser();
  }, []);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-100 text-slate-800 h-screen">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Secret Send- Where you send messages secretly 👾
          </p>
        </section>
        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-xs"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <section className="bg-white flex flex-col justify-center px-4 md:px-20 py-10 text-gray-800">
        <div>
          <h3 className="text-lg md:text-2xl font-bold">Our Users</h3>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-6">
            {users.length > 0 ? (
              users.map((user) => (
                <Card>
                  <CardHeader>
                    <CardTitle>{user.userName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/u/${user.userName}`}>
                      <Button>Message</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No messages to display.</p>
            )}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="text-center p-4 md:p-6  text-gray-800">
        © 2024 SecretSend. All rights reserved.
      </footer>
    </>
  );
}

export default Home;
