"use client";

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav>
      <div>
        <Link href="/">Ease Messages</Link>
        {session ? (
          <>
            <span>Welcome,{user.username || user.email}</span>
            <Button onClick={() => signOut()}>Logout</Button>
          </>
        ) : (
          <Link href={"/sign-in"}>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
