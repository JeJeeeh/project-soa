import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const reduceApiHits = async (userId: number): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  let apiHits = 0;
  if (user) {
    apiHits = user.api_hits;
  } else {
    return false;
  }
  
  if (apiHits < 1){
    if (user.last_request && !haveDifferentDays(user.last_request, new Date())) {
      return false;
    } else {
      await refreshApiHits(userId, user.role_id);

      return true;
    }
  } else {
    try {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          /* eslint-disable */
          api_hits: apiHits - 1,
          last_request: new Date(),
          /* eslint-enable */
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      await prisma.$disconnect();
    }
  }
  return true;
};

const haveDifferentDays = (date1: Date, date2: Date): boolean => {
  return date1.getDate() !== date2.getDate();
};

const refreshApiHits = async (userId: number, roleId: number): Promise<void> => {
  const role = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
  });

  if (!role) return;

  try {
    console.log(role.max_api_hits);
    
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        /* eslint-disable */
        api_hits: role.max_api_hits - 1,
        /* eslint-enable */
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
};
