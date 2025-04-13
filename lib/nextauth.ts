import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

// Ensure required environment variables are set
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth environment variables");
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession['user'];
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
      // First login (when user is returned)
      if (user?.id) {
        token.id = user.id;
        token.picture = user.image ?? null;
        return token;
      }
    
      // If user not returned but token exists, look up from DB only if needed
      if (!token.id && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
          });
    
          if (dbUser) {
            token.id = dbUser.id;
            token.picture = dbUser.image ?? null;
          }
        } catch (error) {
          console.error("Error fetching user from DB in JWT callback:", error);
        }
      }
    
      return token;
    },
    
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
        session.user.image = token.picture ?? session.user.image;
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
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    // Add other providers here, e.g., GitHub (if needed)
  ],
};

export const getAuthSession = () => {
  return getServerSession(authOptions);
}
