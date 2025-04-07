"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useForm } from "react-hook-form";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BookOpen, CopyCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {};
type Input = z.infer<typeof quizCreationSchema>;

interface ApiResponse {
  success: boolean;
  data: any; // Adjust this type based on your API response
}

const QuizCreation = (props: Props) => {
  const router = useRouter();
  const {
    mutate: getQuestions,
    isPending: isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      const response = await axios.post<{ gameId: string }>("/api/game", {
        amount,
        topic,
        type,
      });
      return response.data;
    },
    onSuccess: (data) => {
      const gameId = data.gameId;
      const path = form.getValues("type") === "mcq" 
        ? `/play/mcq/${gameId}` 
        : `/play/open_ended/${gameId}`;
      router.push(path);
    },
    onError: (error) => {
      console.error("Error creating quiz:", error);
      // You can add toast notifications here if needed
    }
  });
  
  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      amount: 3,
      topic: "",
      type: "open_ended",
    },
  });

  function onSubmit(input: Input) {
    getQuestions({
      amount: input.amount,
      topic: input.topic,
      type: input.type,
    });
    onSuccess: ({}) => {
      if (form.getValues("type") == "mcq") {
        router.push("/play/mcq/${gameId}");
      } else {
        router.push("/play/open_ended/${gameId}");
      }
    };
  }

  form.watch();

  return (
    <div className="flex items-center justify-center min-h-screen">
      {" "}
      {/* Centering the card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-2xl">Quiz Creation</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>{" "}
                    {/* Changed from Username to Topic */}
                    <FormControl>
                      <Input placeholder="Enter a topic..." {...field} />
                    </FormControl>
                    <FormDescription>Please provide a topic</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Question</FormLabel>{" "}
                    {/* Changed from Username to Topic */}
                    <FormControl>
                      <Input
                        placeholder="Enter an amount..."
                        {...field}
                        type="number"
                        min={1}
                        max={10}
                        onChange={(e) => {
                          form.setValue("amount", parseInt(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>Please provide a topic</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button
                  type="button"
                  className="w-1/2 rounded-none rounded-l-lg"
                  onClick={() => {
                    form.setValue("type", "mcq");
                  }}
                  variant={
                    form.getValues("type") === "mcq" ? "default" : "secondary"
                  }
                >
                  <CopyCheck className="w-4 h-4 mr-2" /> Multiple Choice
                </Button>
                <Separator orientation="vertical" />
                <Button
                  type="button"
                  className="w-1/2 rounded-none rounded-r-lg"
                  onClick={() => {
                    form.setValue("type", "open_ended");
                  }}
                  variant={
                    form.getValues("type") === "open_ended"
                      ? "default"
                      : "secondary"
                  }
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Oped Ended
                </Button>
              </div>
              <Button disabled={isLoading} type="submit">
                {isLoading ? "Creating Quiz..." : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCreation;
