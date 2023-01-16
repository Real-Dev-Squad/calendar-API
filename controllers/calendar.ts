import { Request, Response } from "express";
import Boom from "@hapi/boom";
import { google } from "googleapis";
import config from "config";
import axios from "axios";
import url from "url";
import prisma from "../prisma/prisma";
import {
  apiResponse,
  calendarResponse,
  externalCalendar,
  rCalData,
} from "../@types/apiReponse";

const gcalClientId = config.get("providers.googleOauth20.clientId");
const gcalClientSecret = config.get("providers.googleOauth20.clientSecret");
const microsoftClientId: string = config.get(
  "providers.microsoftOauth20.clientId"
);
const microsoftClientSecret: string = config.get(
  "providers.microsoftOauth20.clientSecret"
);
const calApiUrl = config.get("services.calendarApi.baseUrl");

const oauth2Client = new google.auth.OAuth2(
  String(gcalClientId),
  String(gcalClientSecret),
  `${String(calApiUrl)}/api/v1/calendar/google/callback`
);

const scopes = ["https://www.googleapis.com/auth/calendar"];
const microsoftCalendarOAuthScopes = ["Calendars.ReadWrite", "offline_access"];

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

const microsoftAuthorizationUrl = ({
  tenant = "common",
  clientId,
  responseType = "code",
  redirectUri,
  responseMode = "query",
  scope,
  state,
}: {
  tenant?: string;
  clientId: string;
  responseType?: string;
  redirectUri: string;
  responseMode?: string;
  scope: string[];
  state?: string;
}): string => {
  return `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?
  client_id=${clientId}
  &response_type=${responseType}
  &redirect_uri=${redirectUri}
  &response_mode=${responseMode}
  &scope=${scope}
  ${state ? `&state=${state}` : ""}
`;
};

const microsoftConnectHandler = (_: Request, res: Response): void => {
  const url = microsoftAuthorizationUrl({
    clientId: microsoftClientId,
    redirectUri: `${String(calApiUrl)}/api/v1/calendar/microsoft/callback`,
    scope: microsoftCalendarOAuthScopes,
  });
  return res.redirect(url);
};

const microsoftCallbackHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  // TODO: fix return type
  try {
    const code = req.query.code as string;
    if (!code) {
      return res.boom(Boom.unauthorized("Cannot authorize"));
    }
    // const userData = req.userData;
    const params = new url.URLSearchParams({
      client_id: microsoftClientId,
      scope: microsoftCalendarOAuthScopes,
      code,
      redirect_uri: `${String(calApiUrl)}/api/v1/calendar/microsoft/callback`,
      grant_type: "authorization_code",
      client_secret: microsoftClientSecret,
    });

    // TODO: Move axios call to wrapper
    const responseTokens = await axios.post(
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // TODO: add cases for 4xx and 5xx
    if (responseTokens.status !== 200) {
      return res.boom(Boom.unauthorized("Do not have enough permission"));
    }

    // TODO: verify the formate
    // Add access tokens to db
    /*
    await prisma.accessToken.create({
      data: {
        userId: userData?.id as number,
        associatedEmail: userData?.email as string, // TODO: add correct email here, assiciated with the microsoft account
        calendarId: "1", // TODO: Add correct calendarId here
        calendarType: "OUTLOOKCAL",
        tokenType: "BEARER",
        scope: responseTokens.data.scope,
        expiry: new Date(
          Number(new Date().getSeconds()) +
          Number(responseTokens.data.expires_in)
          ), // TODO: add expires_in seconds to current time
          accessToken: responseTokens.data.access_token, // TODO: fix token too long error
          refreshToken: responseTokens.data.refresh_token,
        },
      });
    */

    // Redirect to onbording after success
    const redirectUrl = `${String(
      config.get("services.rCalUi.baseUrl")
    )}/onboarding`;

    return res.redirect(redirectUrl);
  } catch (err) {
    logger.error("Error while fetching user microsoft calendar tokens", err);
    return res.boom(Boom.badImplementation());
  }
};

const getUserCalendar = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username } = req.params;
    let externalConnectedCalendars: externalCalendar[] = [];

    // Validate if cookie user is the same  as the username sent in path param
    if (req.userData?.username === username) {
      const userCalendars: rCalData[] = await prisma.calendar.findMany({
        where: {
          ownerId: req.userData.id,
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
          ownerId: true,
          isPrimary: true,
        },
      });

      if (req.query?.external) {
        // Get external calendars connected by the user
        // @todo: Add where clause to get rows only with the specific enum values
        externalConnectedCalendars = await prisma.accessToken.findMany({
          where: {
            userId: req.userData.id,
            expiry: {
              gt: new Date(),
            },
            isDeleted: false,
          },
          select: {
            id: true,
            associatedEmail: true,
            calendarId: true,
            calendarType: true,
          },
        });
      }

      const response: apiResponse<calendarResponse> = {
        data: {
          rCal: userCalendars,
          externalCalendars: externalConnectedCalendars,
        },
      };

      return res.json(response);
    }

    logger.error(
      "User does have permission to get calender, as req.userData.username !== req.params.username"
    );

    return res.boom(Boom.forbidden(config.get("messages.forbidden")));
  } catch (err: any) {
    logger.error("Error while fetching user calendar data", {
      error: err.stack,
    });
    return res.boom(Boom.badImplementation());
  }
};

export {
  googleConnectHandler,
  googleCallbackHandler,
  getUserCalendar,
  microsoftConnectHandler,
  microsoftCallbackHandler,
};
