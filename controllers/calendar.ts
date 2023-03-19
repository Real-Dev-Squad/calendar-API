import { Request, Response } from 'express';
import Boom from '@hapi/boom';
import { google } from 'googleapis';
import config from 'config';
import prisma from '../prisma/prisma';
import {
  apiResponse,
  calendarResponse,
  externalCalendar,
  rCalData,
} from '../@types/apiReponse';

const gcalClientId = config.get('providers.googleOauth20.clientId');
const gcalClientSecret = config.get('providers.googleOauth20.clientSecret');
const calApiUrl = config.get('services.calendarApi.baseUrl');

const oauth2Client = new google.auth.OAuth2(
  String(gcalClientId),
  String(gcalClientSecret),
  `${String(calApiUrl)}/api/v1/calendar/google/callback`
);

const scopes = ['https://www.googleapis.com/auth/calendar'];

const googleConnectHandler = (_: Request, res: Response): void => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });

  return res.redirect(url);
};

const googleCallbackHandler = (_: Request, res: Response): void => {
  const redirectUrl = `${String(
    config.get('services.rCalUi.baseUrl')
  )}/onboarding`;

  return res.redirect(redirectUrl);
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
      'User does have permission to get calender, as req.userData.username !== req.params.username'
    );

    return res.boom(Boom.forbidden(config.get('messages.forbidden')));
  } catch (err: any) {
    logger.error('Error while fetching user calendar data', {
      error: err.stack,
    });
    return res.boom(Boom.badImplementation());
  }
};

export { googleConnectHandler, googleCallbackHandler, getUserCalendar };
