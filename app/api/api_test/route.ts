import { NextResponse } from "next/server";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { strict_output } from "@/lib/gpt";

export const POST = async (req: Request) => {
  try {
    // Parse the request body
    const body = await req.json();
    console.log("Received body:", body);

    // Validate the request body with the schema
    const { amount, topic, type } = quizCreationSchema.parse(body);
    console.log("Parsed data:", { amount, topic, type });

    let questions: any;

    if (type === "open_ended") {
      // Call the OpenAI API to generate questions and answers
      questions = await strict_output(
        "You are a helpful AI that is able to generate a pair of questions and answers, the length of the answer should not exceed 15 words, store all the pairs of answers and questions in a JSON array",
        `You are to generate a random hard open-ended question about ${topic}`,
        {
          question: "question",
          answer: "answer with max length of 15 words",
        }
      );
      console.log("Questions generated:", questions);
    } else {
      console.log("Type is not 'open_ended'. Returning empty array.");
      questions = [];
    }

    // Return response with generated questions
    return NextResponse.json(
      { questions },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error occurred in API:", error);

    if (error instanceof ZodError) {
      // Zod validation error
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors, // Log validation errors
        },
        { status: 400 }
      );
    }

    // Unexpected error
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
};
