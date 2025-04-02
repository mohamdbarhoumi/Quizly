import { getAuthSession } from "@/lib/nextauth";
import { title } from "process";
import {redirect} from "next/navigation";
import React from "react";
import QuizCreation from "@/components/quizCreation";

type Props = {}

export const metadata = {
    title: "Quiz | Quizly",
};

const QuizPage = async(props: Props) => {
    const session = await getAuthSession();
    if(!session?.user){
        return redirect('/')
    }
    return(
        <QuizCreation />
    )
}

export default QuizPage