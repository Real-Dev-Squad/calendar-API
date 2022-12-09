import { Request, Response } from "express";
import { google } from "googleapis";
import config from "config";
import prisma from "../prisma/prisma";

const gcalClientId = config.get("providers.googleOauth20.clientId");
const gcalClientSecret = config.get("providers.googleOauth20.clientSecret");
const calApiUrl = config.get("services.calendarApi.baseUrl");

const oauth2Client = new google.auth.OAuth2(
  String(gcalClientId),
  String(gcalClientSecret),
  `${String(calApiUrl)}/api/v1/calendar/google/callback`
);

const scopes = ["https://www.googleapis.com/auth/calendar"];

const googleConnectHandler = (_: Request, res: Response): void => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });

  return res.redirect(url);
};

const googleCallbackHandler = (_: Request, res: Response): void => {
  const redirectUrl = `${String(
    config.get("services.rCalUi.baseUrl")
  )}/onboarding`;

  return res.redirect(redirectUrl);
};

const getUserCalender = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>> | Express.BoomError<null>> => {
  try {
    const { username } = req.params;

    const userCalenders = await prisma.calendar.findMany({
      where: {
        owner: {
          username,
        },
      },
    });

    return res.json({ data: userCalenders });
  } catch (err) {
    logger.error("Error while fetching user calender data", { err });
    return res.boom.badImplementation("An internal server error occurred");
  }
};

export { googleConnectHandler, googleCallbackHandler, getUserCalender };
