"use client";
import { Game, Question } from "@prisma/client";
import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import MCQCounter from "./MCQCounter";
import axios from "axios";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { title } from "process";
import { event, set } from "d3";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  BarChart,
  ChevronRight,
  CircleCheckBig,
  Loader2,
  Timer,
} from "lucide-react";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "options" | "question">[] };
};

const MCQ = ({ game }: Props) => {
  const [selectedChoice, setSelectedChoice] = React.useState<number>(0);
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [correctAnswers, setCorrectAnswers] = React.useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = React.useState<number>(0);
  const [hasEnded, setHasEnded] = React.useState<boolean>(false);

  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      const payload = checkAnswerSchema.parse({
        questionId: currentQuestion.id,
        userInput: options[selectedChoice],
      });
      const response = await axios.post("/api/checkAnswer", payload);
      return response.data;
    },
  });

  const handleNext = React.useCallback(() => {
    if (selectedChoice === undefined) {
      toast.error("Please select an answer");
      return;
    }
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect !== undefined) {
          toast.success(isCorrect ? "Correct!" : "Wrong!");
          setCorrectAnswers((prev) => (isCorrect ? prev + 1 : prev));
          setWrongAnswers((prev) => (!isCorrect ? prev + 1 : prev));
        }

        setSelectedChoice(0);
        if (questionIndex < game.questions.length - 1) {
          setQuestionIndex((prev) => prev + 1);
        } else {
          toast.success("Quiz completed!");
          setHasEnded(true);
          return;
        }
      },
      onError: (error) => {
        toast.error("An error occurred");
        console.error(error);
      },
    });
  }, [checkAnswer, selectedChoice, questionIndex, game.questions.length]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "1") {
        setSelectedChoice(0);
      } else if (event.key === "2") {
        setSelectedChoice(1);
      } else if (event.key === "3") {
        setSelectedChoice(2);
      } else if (event.key === "4") {
        setSelectedChoice(3);
      } else if (event.key === "Enter") {
        handleNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext]);

  const options = React.useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  if (hasEnded) {
    return (
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
    <div className="relative min-h-screen w-full flex justify-center items-start pt-8">
      <div className="w-[90vw] md:w-[80vw] max-w-4xl">
        <div className="flex flex-row items-center justify-between">
          <div className=" px-2 py-1 flex items-center  text-white rounded-lg bg-slate-800">
            <span className="text-slate-400">Topic: </span>
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
              {game.topic}
            </span>
          </div>

          <div>
            <MCQCounter
              correct_answers={correctAnswers}
              wrong_answers={wrongAnswers}
            />
          </div>
        </div>

        <Card className="mt-2">
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
          {options.map((option, index) => {
            return (
              <Button
                key={index}
                className="justify-start w-full py-8 mb-4"
                variant={selectedChoice === index ? "default" : "secondary"}
                onClick={() => {
                  setSelectedChoice(index);
                }}
              >
                <div className="flex items-center justify-start">
                  <div className="p-2 px-3 mr-5 border rounded-md">
                    {index + 1}
                  </div>
                  <div className="text-start">{option}</div>
                </div>
              </Button>
            );
          })}
          <Button className="mt-2" onClick={handleNext} disabled={isChecking}>
            {isChecking ? "Checking..." : "Next"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MCQ;
