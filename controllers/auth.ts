import passport from 'passport';
import Boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';
import * as authService from '../services/authService';
import { apiResponse } from '../@types/apiReponse';
import { Users } from '@prisma/client';

enum COOKIES_KEYS {
  CALENDAR_ID = 'calendar-id',
  USERNAME = 'username',
}

/**
 *
 * Sets cookies for
 * @param res {Object}
 * @param user {Users & { calendarId: number }}
 */
const setCookies = (
  res: Response,
  user: Users & { calendarId: number }
): void => {
  const COOKIE_OPTIONS: any = {
    domain: config.get('userAccessToken.cookieDomain'),
    expires: new Date(Date.now() + config.get('userAccessToken.ttl') * 1000),
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  };

  const token = authService.generateAuthToken({ userId: user.id });

  res.cookie(config.get('userAccessToken.cookieName'), token, COOKIE_OPTIONS);
  res.cookie(COOKIES_KEYS.CALENDAR_ID, user.calendarId, {
    ...COOKIE_OPTIONS,
    httpOnly: false,
  });
  res.cookie(COOKIES_KEYS.USERNAME, user.username ?? '', {
    ...COOKIE_OPTIONS,
    httpOnly: false,
  });
};

/**
 * Makes authentication call to google strategy
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 * @param next {Function} - Express middleware function
 */
const googleAuthLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const redirectURL = req.query.redirectURL as string;
  return passport.authenticate('google', {
    scope: ['email', 'profile'],
    state: redirectURL,
  })(req, res, next);
};

/**
 * Fetches the user info from Google and authenticates User
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 * @param next {Function} - Express middleware function
 */
const googleAuthCallback = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const redirectURL = req.query.state as string;

  let rCalUiUrl = new URL(config.get('services.rCalUi.baseUrl'));

  if (redirectURL) {
    try {
      rCalUiUrl = new URL(redirectURL);
    } catch (error) {
      logger.error('Invalid redirect URL provided');
      logger.error(error);
    }
  }

  try {
    return passport.authenticate('google', {}, async (err, _, user) => {
      if (err) {
        logger.error(err);
        return res.boom(Boom.unauthorized('User cannot be authenticated'));
      }

      const data = await authService.loginOrSignupWithGoogle(user._json);

      // respond with a cookie
      setCookies(res, data);

      return res.redirect(rCalUiUrl.href);
    })(req, res, next);
  } catch (err: any) {
    logger.error(err);

    // Redirect to an error page in case of an error
    return res.redirect(rCalUiUrl.href);
  }
};

const microsoftAuthCallback = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const rCalUiUrl = new URL(config.get('services.rCalUi.baseUrl'));

  try {
    return passport.authenticate('microsoft', {}, async (err, _, user) => {
      if (err) {
        logger.error(err);
        return res.boom(Boom.unauthorized('User cannot be authenticated'));
      }
      const data = await authService.loginOrSignupWithMicrosoft(user._json);

      // respond with a cookie
      setCookies(res, data);

      return res.redirect(rCalUiUrl.href);
    })(req, res, next);
  } catch (err: any) {
    logger.error(err);

    // Redirect to an error page in case of an error
    return res.redirect(rCalUiUrl.href);
  }
};

// Logs out the user from the device
const logOut = (_req: Request, res: Response): Response => {
  const cookieName = config.get('userAccessToken.cookieName');

  res.clearCookie(cookieName, {
    domain: config.get('userAccessToken.cookieDomain'),
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });
  const response: apiResponse<null> = {
    message: 'SignOut successful',
  };

  return res.status(200).json(response);
};

export { googleAuthLogin, googleAuthCallback, microsoftAuthCallback, logOut };
