import HistoryCard from "@/components/historyCard";
import HotTopicsCard from "@/components/hostTopicsCard";
import QuizMeCard from "@/components/quizMeCard";
import RecentActivities from "@/components/recentActivities";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { title } from "process";
import React from "react";

type Props = {}
export const metadata = {
    title: "Dashboard | Quizly",
};

const Dashboard = async (props: Props) =>{
    const session = await getAuthSession();
    if(!session?.user){
        return redirect("/");
    }
    return(
        <main className="p-8 mx-auto max-w-7xl">
            <section className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Welcome back, {session.user.name?.split(" ")[0] || "Quizzer"} 👋
        </h2>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Ready to challenge yourself today? Let’s get started!
        </p>
      </section>
            <div className="grid gap-4 mt-4 md:grid-cols-2">
                <QuizMeCard />
                <HistoryCard />
            </div>
            <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
            <HotTopicsCard />
            <RecentActivities /> 
            </div>
        </main>
    )
}
export default Dashboard        