'use client';
import { Game, Question } from "@prisma/client";
import { BarChart, ChevronRight, CircleCheckBig, Loader2 } from "lucide-react";
import React from "react";
import { Button, buttonVariants } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { checkAnswerSchema, endGameSchema, z } from "@/schemas/form/quiz";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import BlankAnswerInput from "./blankAnswerInput";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  game: Game & {questions: Pick<Question, "id" | "question" | "answer">[]};
};

const OpenEnded = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [hasEnded, setHasEnded] = React.useState<boolean>(false);
  const [blankAnswer, setBlankAnswer] = React.useState<string>("");
  const [averagePercentage, setAveragePercentage] = React.useState(0);
  
  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = {
        gameId: game.id,
      };
      const response = await axios.post(`/api/endGame`, payload);
      return response.data;
    },
  });

  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      let filledAnswer = blankAnswer;
      const inputs = document.querySelectorAll<HTMLInputElement>("#user-blank-input");
      inputs.forEach((input: HTMLInputElement) => {
        filledAnswer = filledAnswer.replace("_____", input.value);
        input.value = "";
      });
      const payload = checkAnswerSchema.parse({
        questionId: currentQuestion.id,
        userInput: filledAnswer,
      });
      const response = await axios.post("/api/checkAnswer", payload);
      return response.data;
    },
  });

  const handleNext = React.useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilar }) => {
        toast.success(`Your answer is ${percentageSimilar}% similar to the correct answer`);

        setAveragePercentage((prev) => {
          return (prev + percentageSimilar) / (questionIndex + 1);
        });

        if (questionIndex === game.questions.length - 1) {
          endGame();
          setHasEnded(true);
          return;
        }

        setQuestionIndex((prev) => prev + 1);
      },
      onError: (error) => {
        console.error(error);
        toast.error("Something went wrong");
      },
    });
  }, [checkAnswer, questionIndex, endGame, game.questions.length]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext]);

  if (hasEnded) {
    return(
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 backdrop-blur-md">
        <div
          className="
  flex items-center justify-center 
  px-6 py-4 mb-6 
  text-xl font-bold text-white 
  bg-gradient-to-r from-green-600 to-green-500
  rounded-xl shadow-lg
  border-2 border-green-400/20
  hover:shadow-green-400/20 hover:-translate-y-0.5
  transition-all duration-300
  group
"
        >
          You have completed the Quiz
          <CircleCheckBig
            className="
    w-7 h-7 ml-3
    text-green-100 
    group-hover:scale-110 group-hover:text-white
    transition-transform duration-200
  "
          />
        </div>

        <Link
          href={`/statistics/${game.id}`}
          className={cn(
            buttonVariants({ size: "lg", variant: "default" }),
            "group", // Enables group-hover effects
            "bg-gradient-to-r from-blue-600 to-blue-500", // Gradient background
            "hover:from-blue-700 hover:to-blue-600", // Hover gradient
            "text-white shadow-lg", // Text and shadow
            "hover:shadow-blue-500/30", // Glow effect
            "transition-all duration-300", // Smooth transitions
            "border border-blue-400/20", // Subtle border
            "hover:-translate-y-0.5" // Lift effect
          )}
        >
          <span className="mr-1">View Statistics</span>
          <BarChart
            className="
    w-5 h-5 
    text-blue-100 
    group-hover:text-white 
    group-hover:scale-110 
    transition-transform duration-200
  "
          />
        </Link>
      </div>
    );
  }

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw] top-1/2 left-1/2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <p>
            <span className="text-slate-400">Topic</span> &nbsp;
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
              {game.topic}
            </span>
          </p>
        </div>
        <div className="px-2 py-1 text-white rounded-lg bg-slate-800">
          {Math.round(averagePercentage)}% match
        </div>
      </div>
      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4">
        <BlankAnswerInput answer={currentQuestion.answer} setBlankAnswer={setBlankAnswer} />
        <Button
          variant="outline"
          className="mt-4"
          disabled={isChecking || hasEnded}
          onClick={handleNext}
        >
          {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OpenEnded;