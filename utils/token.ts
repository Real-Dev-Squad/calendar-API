import { AccessToken, Prisma, PrismaClient } from '@prisma/client';

type TokenArgs = Prisma.AccessTokenUncheckedCreateInput;

const prisma = new PrismaClient();

/**
 * Creates a new token if there is not token with the "associatedEmail" field.
 * More on prisma's upsert method here: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#upserthttps://www.prisma.io/docs/reference/api-reference/prisma-client-reference#upsert
 *
 * @param token {TokenArgs} - Token that has to be created/updated.
 * */
const upsertToken = async (data: TokenArgs): Promise<AccessToken | Error> => {
  try {
    const upsertData = await prisma.accessToken.upsert({
      where: {
        AccessToken_userId_calendarId_uindex: {
          calendarId: data.calendarId,
          userId: data.userId,
        },
      },
      create: data,
      update: data,
    });

    return upsertData;
  } catch (error) {
    logger.error(error);
    throw new Error(JSON.stringify(error));
  }
};

export default upsertToken;
