import { authOptions } from "@/lib/nextauth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
