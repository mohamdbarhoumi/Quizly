"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { quizCreationSchema } from "@/schemas/form/quiz";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, CopyCheck } from "lucide-react";

import LoadingQuestions from "./LoadingQuestions";

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = () => {
  const router = useRouter();
  const [showLoader, setShowLoader] = React.useState(false);

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: "",
      amount: 3,
      type: "open_ended",
    },
  });

  const selectedType = form.watch("type");

  const { mutate: getQuestions, isPending } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      const response = await axios.post<{ gameId: string }>("/api/game", {
        amount,
        topic,
        type,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setShowLoader(true); // show loading only on success
      const gameId = data.gameId;
      const path =
        form.getValues("type") === "mcq"
          ? `/play/mcq/${gameId}`
          : `/play/open_ended/${gameId}`;
      router.push(path);
    },
    onError: (err) => {
      console.error("Quiz creation error:", err);
    },
  });

  const onSubmit = (input: Input) => {
    getQuestions(input); // no need to show loader here yet
  };

  if (showLoader) {
    return <LoadingQuestions finished={false} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-8">
      <Card className="w-full max-w-xl border border-border shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-semibold text-foreground">
            Create a Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. JavaScript, React, History..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>What is your quiz about?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        placeholder="3"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          const parsed = parseInt(val, 10);
                          field.onChange(val === "" ? undefined : isNaN(parsed) ? 1 : parsed);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Max: 10 questions per quiz
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button
                  variant={selectedType === "mcq" ? "default" : "secondary"}
                  className="w-1/2 rounded-none rounded-l-lg"
                  onClick={() => form.setValue("type", "mcq")}
                  type="button"
                >
                  <CopyCheck className="w-4 h-4 mr-2" /> Multiple Choice
                </Button>
                <Separator orientation="vertical" />
                <Button
                  variant={
                    selectedType === "open_ended" ? "default" : "secondary"
                  }
                  className="w-1/2 rounded-none rounded-r-lg"
                  onClick={() => form.setValue("type", "open_ended")}
                  type="button"
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Open Ended
                </Button>
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating..." : "Start Quiz"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCreation;