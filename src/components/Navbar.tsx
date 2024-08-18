"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white  w-full">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="/" className="text-lg sm:text-xl font-bold mb-4 md:mb-0">
          Ease Feedback
        </a>
        {session ? (
          <>
            <span className="mr-4 my-2">
              Welcome, {user.username || user.email}
            </span>
            <div className="md:space-x-2 space-y-2 sm:space-y-0">
              <Link href="/dashboard">
                <Button
                  className="w-full md:w-auto bg-slate-100 text-black"
                  variant={"outline"}
                >
                  dashboard
                </Button>
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
          <div className="md:space-x-2 ">
            <Link href="/sign-in">
              <Button
                className="w-full md:w-auto bg-slate-100 text-black"
                variant={"outline"}
              >
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                className="w-full md:w-auto bg-slate-100 text-black my-2"
                variant={"outline"}
              >
                Sign up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
