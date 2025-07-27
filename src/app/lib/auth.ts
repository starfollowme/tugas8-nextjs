import { NextAuthOptions, DefaultSession } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { userService } from "./db"; 


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}


export const authOptions: NextAuthOptions = {

  providers: [
    CredentialsProvider({
     
      name: "credentials",
     
      credentials: {
        email: { label: "Email", type: "email", placeholder: "nama@contoh.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan kata sandi diperlukan.");
        }

        const user = await userService.findByEmail(credentials.email);
        
        if (!user || !user.password) {
          throw new Error("Pengguna tidak ditemukan.");
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        
        if (!passwordMatch) {
          throw new Error("Kata sandi salah.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

 
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};
