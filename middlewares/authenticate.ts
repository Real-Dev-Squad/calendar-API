import * as authService from "../services/authService";
import prisma from "../prisma/prisma";
import { NextFunction, Request, Response } from "express";

/**
 * Middleware to validate the authenticated routes
 * 1] Verifies the token and adds user info to `req.userData` for further use
 * 2] In case of JWT expiry, adds a new JWT to the response if `currTime - tokenInitialisationTime <= refreshTtl`
 *
 * The currently implemented mechanism satisfies the current use case.
 * Authentication with JWT and a refreshToken to be added once we have user permissions and authorizations to be handled*
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 * @param next {Function} - Express middleware function
 * @return {Object} - Returns unauthenticated object if token is invalid
 */
const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.cookies[config.get("userAccessToken.cookieName")];

    /**
     * Enable Bearer Token authentication for NON-PRODUCTION environments
     * This is enabled just to ease the authentication in the non-production environments
     */
    if (process.env.NODE_ENV !== "production" && !token) {
      token = req.get("authorization")?.split(" ")[1];
    }

    const { userId } = authService.verifyAuthToken(token);

    // add user data to `req.userData` for further use
    req.userData = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    return next();
  } catch (err: any) {
    logger.error("Error in verifying user token", { error: err.stack });

    if (err.name === "TokenExpiredError") {
      const refreshTtl = config.get("userAccessToken.refreshTtl");
      const token = req.cookies[config.get("userAccessToken.cookieName")];
      const { userId, iat } = authService.decodeAuthToken(token);
      const newToken = authService.generateAuthToken({ userId });
      const rdsUiUrl = new URL(config.get("services.rCalUi.baseUrl"));

      // add new JWT to the response if it satisfies the refreshTtl time
      if (Math.floor(Date.now() / 1000) - iat <= refreshTtl) {
        res.cookie(config.get("userAccessToken.cookieName"), newToken, {
          domain: rdsUiUrl.hostname,
          expires: new Date(
            Date.now() + config.get("userAccessToken.ttl") * 1000
          ),
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        });

        // add user data to `req.userData` for further use
        req.userData = await prisma.users.findUnique({
          where: {
            id: userId,
          },
        });

        return next();
      } else {
        logger.error("User cannot be authenticated as refreshTtl has passed.", {
          userId,
        });
        return res.boom.unauthorized("Unauthenticated User");
      }
    } else {
      logger.error("User cannot be authenticated.", { err });
      return res.boom.unauthorized("Unauthenticated User");
    }
  }
};

export default authenticate;
