"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Portal Artikel
        </Link>
        
        <div className="flex space-x-4 items-center">
          <Link href="/" className="hover:text-blue-200">
            Home
          </Link>
          
          {status === "loading" ? (
            <span>Loading...</span>
          ) : session ? (
            <>
              <Link href="/dashboard" className="hover:text-blue-200">
                Dashboard
              </Link>
              <span className="text-blue-200">
                Halo, {session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-200">
                Login
              </Link>
              <Link href="/register" className="hover:text-blue-200">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}