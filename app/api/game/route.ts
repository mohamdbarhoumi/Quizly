import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";

// Type definitions
type MCQQuestion = {
  question: string;
  answer: string;
  option1: string;
  option2: string;
  option3: string;
};

type OpenQuestion = {
  question: string;
  answer: string;
};

export async function POST(req: Request) {
  try {
    // Authentication check
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to create a game." },
        { status: 401 }
      );
    }

    // Request validation
    const body = await req.json();
    const { topic, type, amount } = quizCreationSchema.parse(body);

    // Input validation
    if (amount < 1 || amount > 10) {
      return NextResponse.json(
        { error: "Amount must be between 1 and 10" },
        { status: 400 }
      );
    }

    let gameId: string;
    try {
      // Extended transaction with higher timeout
      const result = await prisma.$transaction(async (prisma) => {
        // Create game record
        const game = await prisma.game.create({
          data: {
            gametype: type,
            timeStarted: new Date(),
            userId: session.user.id,
            topic,
          },
        });

        // Update topic count
        await prisma.topicCount.upsert({
          where: { topic },
          create: { topic, count: 1 },
          update: { count: { increment: 1 } },
        });

        // Generate questions
        const { data } = await axios.post(
          `${process.env.API_URL}/api/questions`,
          { amount, topic, type },
          { timeout: 10000 } // 10 second timeout for question generation
        );

        if (!data?.questions) {
          throw new Error("No questions were generated");
        }

        // Process questions in batches
        if (type === "mcq") {
          const batchSize = 5;
          const allQuestions = data.questions.map((question: MCQQuestion) => ({
            question: question.question,
            answer: question.answer,
            options: JSON.stringify([
              question.option1,
              question.option2,
              question.option3,
              question.answer,
            ].sort(() => Math.random() - 0.5)),
            gameId: game.id,
            questionType: "mcq",
          }));

          // Batch insert
          for (let i = 0; i < allQuestions.length; i += batchSize) {
            await prisma.question.createMany({
              data: allQuestions.slice(i, i + batchSize),
            });
          }
        } else {
          // Open-ended questions (single insert)
          await prisma.question.createMany({
            data: data.questions.map((question: OpenQuestion) => ({
              question: question.question,
              answer: question.answer,
              gameId: game.id,
              questionType: "open_ended",
            })),
          });
        }

        return game.id;
      }, {
        maxWait: 20000, // Maximum wait time for the transaction
        timeout: 15000 // Transaction execution timeout
      });

      gameId = result;
    } catch (transactionError) {
      console.error("Transaction failed:", transactionError);
      return NextResponse.json(
        { error: "Question generation took too long. Please try fewer questions." },
        { status: 500 }
      );
    }

    return NextResponse.json({ gameId }, { status: 200 });

  } catch (error) {
    console.error("Error in POST handler:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : "An unexpected error occurred" 
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to view a game." },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const gameId = url.searchParams.get("gameId");
    
    if (!gameId) {
      return NextResponse.json(
        { error: "You must provide a game id." },
        { status: 400 }
      );
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { questions: true },
    });
    
    if (!game) {
      return NextResponse.json(
        { error: "Game not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ game }, { status: 200 });

  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}