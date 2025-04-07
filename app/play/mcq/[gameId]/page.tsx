import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/dist/server/api-utils";
import React from "react";
type Props = {
    params:{
        gameId: string;
    };
};

const MCQPage = async ({params: {gameId}}: Props) => {
    const session = await getAuthSession();
    if(!session?.user) {
        return redirect('/');
    }
    const game = await prisma.game.findUnique({
        where: {
            id: gameId
        },
        include:{
            questions: {
                select: {
                id: true,
                question: true,
                options: true,
            },
        },
        },
    });
    if(!game || game.gametype !== "mcq"){
        return('/quiz')
    }
    return(
        <div>{JSON.stringify(game, null, 2)}</div>
    )
}

export default MCQPage