import Navbar from "@/components/navbar";
import SignInButton from "@/components/SignInButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthSession } from "@/lib/nextauth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getAuthSession();
  if(session?.user){
    return redirect('/dashboard')
  }
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <Card className="w-[300px]">
          <CardHeader>
            <CardTitle>Welcome To Quizly!</CardTitle>
            <CardDescription>
              Quizly is a quiz app that allows you to create and share quizzes with your friends. 
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInButton text={"Sign In with google!"} />
          </CardContent>
        </Card>
    </div>  

  );
}
