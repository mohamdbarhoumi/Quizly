import MCQ from "@/components/MCQ";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

// PageProps now expects params and searchParams to be Promises
interface PageProps {
  params: Promise<{ gameId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MCQPage({
  params,
  searchParams,
}: PageProps) {
  // Await both params and searchParams
  const { gameId } = await params;
  const queryParams = searchParams ? await searchParams : undefined;

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
            options: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching game:", error);
    redirect('/error');
  }

  if (!game || game.gametype !== "mcq") {
    redirect('/quiz');
  }

  return <MCQ game={game} />;
}
