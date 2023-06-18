import { Request, Response } from "express"
import { DailyBread, PrismaClient } from '@prisma/client';
import { StatusCode } from "../helpers/statusCode";
import axios from '../config/axiosConfig';
import { IVerse, IVerseData } from "../interfaces/verseInterfaces";
import { AxiosResponse } from "axios";
import { BibleExceptions } from "../exceptions/bibleExceptions";
const prisma = new PrismaClient();

interface IDailyBread {
  bibleId: string;
  verseId: string;
}

export const getDailyBread = async (req: Request, res: Response): Promise<void> => {
  const details = await getDetails();
  
  if (!details)
{
  throw new BibleExceptions(StatusCode.BAD_REQUEST, "Unable to get daily bread");
}
  const response: AxiosResponse<IVerse> = await axios.get(`/bibles/${details.bibleId}/verses/${details.verseId}`, {
    params: {
      "content-type": "text",
    }
  });
  const data: IVerseData = response.data.data;
  res.status(StatusCode.OK).json({
    title: data.reference,
    content: data.content.trim(),
  });
  return;
}

async function getDetails(): Promise<IDailyBread | null> {
  const randomId = Math.floor(Math.random() * 6) + 1;

  let result: DailyBread | null = null;
  try {
    result = await prisma.dailyBread.findUnique({
      where: {
        id: randomId
      }
    });
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }

  return result;
}