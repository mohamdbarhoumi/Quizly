import { prisma } from "@/lib/db";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { questionId, userAnswer } = checkAnswerSchema.parse(body);

        // Use transaction for atomic updates
        const result = await prisma.$transaction(async (tx) => {
            const question = await tx.question.findUnique({
                where: { id: questionId }
            });

            if (!question) {
                throw new Error("Question not found");
            }

            let isCorrect = false;
            if (question.questionType === 'mcq') {
                isCorrect = question.answer.toLowerCase().trim() === 
                          userAnswer.toLowerCase().trim();
            }

            // Single update operation
            await tx.question.update({
                where: { id: questionId },
                data: {
                    userAnswer,
                    isCorrect: question.questionType === 'mcq' ? isCorrect : undefined
                }
            });

            return { 
                isCorrect,
                message: question.questionType === 'mcq' 
                    ? "MCQ answer evaluated" 
                    : "Answer recorded"
            };
        });

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error.issues },
                { status: 400 }
            );
        }

        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: error.message === "Question not found" ? 404 : 500 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}