import { Request, Response } from "express";
import Boom from "@hapi/boom";
import prisma from "../prisma/prisma";
import { Users } from "@prisma/client";
import { apiResponse, usernameAvailability } from "../@types/apiReponse";

/**
 * Route used to get the health status of the server
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const getSelfData = (req: Request, res: Response): Response => {
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

      const response: apiResponse<typeof userData> = {
        data: userData,
      };

      return res.json(response);
    }

    logger.info("User does not exist, as req.userData is empty");
    return res.boom(Boom.notFound("User doesn't exist"));
  } catch (err) {
    logger.error("Error while fetching user", { err });
    return res.boom(
      Boom.badImplementation("An internal server error occurred")
    );
  }
};

const patchSelfData = async (
  req: Request,
  res: Response
): Promise<Response> => {
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

    logger.info("User data updated");

    const response: apiResponse<null> = {
      message: "User data updated",
    };

    return res.json(response);
  } catch (err) {
    logger.error("Error while updating user", { err });
    return res.boom(
      Boom.badImplementation("An internal server error occurred")
    );
  }
};

const usernameAvailability = async (req: Request, res: Response): Promise<Response> => {
  try {
    const desiredUsername = req.params?.username
    let available = false

    if (desiredUsername) {
      const userData = await prisma.users.findUnique({
        where: {
          username: desiredUsername,
        },
      });

      if (!userData) {
        available = true
      }

      const response: apiResponse<usernameAvailability> = {
        data: {
          username: desiredUsername,
          available: available
        }
      };

      return res.json(response);
    }

    logger.info("User does not exist, as req.userData is empty");
    return res.boom(Boom.notFound("User doesn't exist"));
  } catch (err) {
    logger.error("Error while fetching user", { err });
    return res.boom(
        Boom.badImplementation("An internal server error occurred")
    );
  }
};


export { getSelfData, patchSelfData, usernameAvailability };
