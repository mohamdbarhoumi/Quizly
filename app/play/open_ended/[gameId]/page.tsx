import OpenEnded from "@/components/opedEnded";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

// PageProps now expects params to be wrapped in a Promise
interface PageProps {
  params: Promise<{ gameId: string }>;
}

export default async function OpenEndedPage({
  params,
}: PageProps) {
  // Await the params promise
  const { gameId } = await params;

  const session = await getAuthSession();
  if (!session?.user) {
    redirect('/');
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
            answer: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching game:", error);
    redirect('/error');
  }

  if (!game || game.gametype !== "open_ended") {
    redirect('/quiz');
  }

  return <OpenEnded game={game} />;
}
