import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const reduceApiHits = async ($user_id: number): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      id: $user_id
    }
  });

  const apiHits: number = user!.api_hits;
  
  if (apiHits === 0){
    return false;
  }

  try {
    await prisma.user.update({
      where: {
        id: $user_id
      },
      data: {
        api_hits: apiHits - 1
      }
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }

  return true;
}