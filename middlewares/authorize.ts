import Boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import { findCalendarWithId, findEventWithId } from '../services/eventsService';

/**
 * Middleware to authorize if the calendar belongs to the user
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 * @param next {Function} - Express middleware function
 * @return {Object} - Returns unauthenticated object if token is invalid
 */
const calendarBelongsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any | Response> => {
  try {
    const userId = req.userData.id;
    const calendarId = req.body.calendarId;

    const calendarData = await findCalendarWithId(calendarId);

    if (calendarData === null) {
      logger.error('Calendar not found.');
      return res.boom(Boom.notFound('Calendar not found'));
    }

    if (calendarData.ownerId !== userId) {
      logger.info('Calendar does not belong to user');
      return res.boom(Boom.forbidden('Calendar does not belong to user'));
    }

    return next();
  } catch (err: any) {
    logger.error('An internal server error occurred', { err: err.stack });
    return res.boom(
      Boom.badImplementation('An internal server error occurred')
    );
  }
};

const eventBelongsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any | Response> => {
  try {
    const { eventId } = req.params;
    const userId = req.userData.id;

    const eventData = await findEventWithId(+eventId);

    if (eventData === null) {
      logger.info('Event not found');
      return res.boom(Boom.notFound());
    }

    if (eventData.ownerId !== userId) {
      logger.info('Event does not belong to user');
      return res.boom(Boom.forbidden('Event does not belong to user'));
    }

    return next();
  } catch (err: any) {
    logger.error('An internal server error occurred', { err: err.stack });
    return res.boom(
      Boom.badImplementation('An internal server error occurred')
    );
  }
};

export { calendarBelongsToUser, eventBelongsToUser };
