import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";



const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      // If a user is returned after signing in, assign their ID to the token
      if (user) {
        token.id = user.id;
      } else {
        // Look up the user from the database if there's an existing token
        const db_user = await prisma.user.findFirst({
          where: {
            email: token?.email,
          },
        });
        if (db_user) {
          token.id = db_user.id;
        }
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,  
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export const getAuthSession = () =>{
  return(
    getServerSession(authOptions)
  )
}
