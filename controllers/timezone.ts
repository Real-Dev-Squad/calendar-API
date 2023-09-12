import { Request, Response } from 'express';
import Boom from '@hapi/boom';
import { getTimeZones } from '../utils/timezone';

/**
 * Route used to get the health status of the server
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const timezone = (req: Request, res: Response): Response => {
  try {
    const userTz = req.query.userTz as string;

    const { timeZones, userTimeZoneIndex } = getTimeZones(userTz);

    return res.json({ data: { timeZones, userTimeZoneIndex } });
  } catch (err) {
    logger.error('Error while getting timezones', { err });
    return res.boom(Boom.badImplementation());
  }
};

export default timezone;
