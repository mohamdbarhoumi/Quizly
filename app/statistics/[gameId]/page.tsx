import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import ResultsCard from "@/components/statistics/ResultsCard";
import QuestionsList from "@/components/statistics/QuestionsList";

// Make params a Promise that resolves to the actual object
interface PageProps {
  params: Promise<{ gameId: string }>;
}

const Statistics = async ({ params }: PageProps) => {
  // Await the params to extract gameId
  const { gameId } = await params;

  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { questions: true },
  });
  if (!game) {
    return redirect("/");
  }

  let accuracy: number = 0;

  // Calculate accuracy for different game types
  if (game.gametype === "mcq") {
    let totalCorrect = game.questions.reduce((acc: number, question: { isCorrect: any; }) => {
      if (question.isCorrect) {
        return acc + 1;
      }
      return acc;
    }, 0);
    accuracy = (totalCorrect / game.questions.length) * 100;
  } else if (game.gametype === "open_ended") {
    let totalPercentage = game.questions.reduce((acc: any, question: { percentageCorrect: any; }) => {
      return acc + (question.percentageCorrect ?? 0);
    }, 0);
    accuracy = totalPercentage / game.questions.length;
  }

  // Round accuracy to two decimal places
  accuracy = Math.round(accuracy * 100) / 100;

  return (
    <div className="p-4 md:p-8 mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Performance Summary
          </h2>
          <p className="text-sm text-muted-foreground">
            Detailed breakdown of your quiz results
          </p>
        </div>
        <div>
          <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
            <LucideLayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <ResultsCard accuracy={accuracy} />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Question Breakdown
        </h3>
        <QuestionsList questions={game.questions} />
      </div>
    </div>
  );
};

export default Statistics;
