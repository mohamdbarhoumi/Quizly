import {z} from 'zod'

export const quizCreationSchema = z.object({
    amount: z.number().min(1).max(10),
    topic: z.string().min(4, {message:"Topic must be at least 4 characters long"}),
    type: z.enum(["mcq", "open_ended"]),
    
});


export const checkAnswerSchema = z.object({
    questionId: z.string(),
    userInput: z.string(),
});

export const endGameSchema = z.object(({
    gameId: z.string(),
}))

export { z } from "zod";