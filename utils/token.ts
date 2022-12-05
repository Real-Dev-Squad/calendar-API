import { AccessToken, Prisma, PrismaClient } from "@prisma/client";

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
        AccessToken_constraint: {
          calendarId: data.calendarId,
          calendarType: data.calendarType,
          userId: data.userId,
        },
      },
      create: data,
      update: data,
    });

    return upsertData;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        logger.error(
          "Code: P2002. Message: There is a unique constraint violation, a new AccessToken cannot be created with this email"
        );

        throw new Error("P2002");
      }
    }

    throw error;
  }
};

export default upsertToken;
