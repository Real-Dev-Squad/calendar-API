import { Request, Response } from "express";
import { google } from "googleapis";
import config from "config";

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

export { googleConnectHandler, googleCallbackHandler };
