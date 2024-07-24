"use client";

import { signOut, useSession } from "next-auth/react";
import React from "react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import Link from "next/link";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

//   console.log(user);
//   console.log(session)
  return (
    <nav className="p-4 md:p-5 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="/" className="text-xl font-bold mb-4 md:mb-0">
          SecretSend
        </a>
        {session ? (
          <>
            <span className="mr-4">Welcome, {user.userName || user.email}</span>
            <div className="text-center">
              <Link href={"/dashboard"} className="mr-4">
                Dashboard
              </Link>
              <Button
                onClick={() => signOut()}
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                Logout
              </Button>
            </div>
          </>
        ) : (
          <>
            <Link href="/sign-in">
              <Button
                className="w-full md:w-auto bg-slate-100 text-black"
                variant={"outline"}
              >
                Login
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
