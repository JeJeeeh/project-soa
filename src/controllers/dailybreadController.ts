import { Request, Response } from "express"

interface IDailyBread {
  bibleId: string;
  verseId: string;
}

export const getDailyBread = async (req: Request, res: Response): Promise<void> => {
  return;
}

async function getDetails(): Promise<IDailyBread> {
  const randomId = Math.floor(Math.random() * 6) + 1;

  const result = await prisma.dailyBread.findUnique({
    where: {
      id: randomId,
    },
  });
}