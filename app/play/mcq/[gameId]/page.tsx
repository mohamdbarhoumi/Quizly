import MCQ from "@/components/MCQ";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";



type Props = {
    params: {
        gameId: string;
    };
};


const MCQPage = async ({ params: { gameId } }: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect('/');
    }

    let game;
    try {
        game = await prisma.game.findUnique({
            where: {
                id: gameId,
            },
            include: {
                questions: {
                    select: {
                        id: true,
                        question: true,
                        options: true,
                    },
                },
            },
        });
    } catch (error) {
        console.error("Error fetching game:", error);
        return redirect('/error'); // Redirect to an error page or show an error message
    }

    if (!game || game.gametype !== "mcq") {
        return redirect('/quiz');
    }

    return (
        <MCQ game={game} />
    );
};

export default MCQPage;