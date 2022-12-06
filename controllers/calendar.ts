import { Request, Response } from "express";
import { google } from "googleapis";
import config from "config";

const gcalClientId = config.get("calendarAccessToken.gcal.clientId");
const gcalClientSecret = config.get("calendarAccessToken.gcal.clientSecret");
const calApiUrl = config.get("services.calendarApi.baseUrl");

const oauth2Client = new google.auth.OAuth2(
  String(gcalClientId),
  String(gcalClientSecret),
  `${calApiUrl}/api/v1/calendar/google/callback`
);

const scopes = ["https://www.googleapis.com/auth/calendar"];

const googleConnectHandler = (_: Request, res: Response): void => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });

  res.redirect(url);
};

const googleCallbackHandler = async (
  _: Request,
  res: Response
): Promise<void> => {
  const redirectUrl = `${config.get("services.rCalUi.baseUrl")}/onboarding`;

  res.redirect(redirectUrl);
};

export { googleConnectHandler, googleCallbackHandler };
