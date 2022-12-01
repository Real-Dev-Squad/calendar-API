import { Request, Response } from "express";
import prisma from "../prisma/prisma";
import { Users } from "@prisma/client";

/**
 * Route used to get the health status of the server
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const getSelfData = (
  req: Request,
  res: Response
): Response<any, Record<string, any>> | Express.BoomError<null> => {
  try {
    if (req.userData) {
      const fullUserDataAll: Users = req.userData;
      const userData = {
        id: fullUserDataAll.id,
        email: fullUserDataAll.email,
        username: fullUserDataAll.username,
        firstname: fullUserDataAll.firstname,
        lastname: fullUserDataAll.lastname,
        bio: fullUserDataAll.bio,
        timezone: fullUserDataAll.timezone,
        onboarding: fullUserDataAll.onboarding,
        emailVerified: fullUserDataAll.emailVerified,
      };

      return res.json(userData);
    }

    logger.info("User does not exist, as req.userData is empty");
    return res.boom.notFound("User doesn't exist");
  } catch (err) {
    logger.error("Error while fetching user", { err });
    return res.boom.badImplementation("An internal server error occurred");
  }
};

const patchSelfData = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>> | Express.BoomError<null>> => {
  try {
    const { userData } = req;
    const userId = userData?.id;
    const onboardingUserData: any = userData?.onboarding;
    const { firstname, lastname, bio, username, onboarding, timezone } =
      req.body;
    const { isOnboarded } = onboarding ?? {};

    // Allowed fields to edit from patch call
    const data = {
      firstname,
      lastname,
      bio,
      username,
      timezone,
      onboarding: {
        isOnboarded:
          isOnboarded !== undefined
            ? isOnboarded
            : onboardingUserData.isOnboarded,
      },
    };

    await prisma.users.update({
      where: {
        id: userId,
      },
      data,
    });

    logger.error("User data updated");
    return res.status(200).send({ message: "User data updated" });
  } catch (err) {
    logger.error("Error while updating user", { err });
    return res.boom.badImplementation("An internal server error occurred");
  }
};

export { getSelfData, patchSelfData };
