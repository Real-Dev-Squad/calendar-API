import { Router } from 'express';
import { getCalendarEvents, getEvents, postEvent } from '../controllers/events';
import authenticate from '../middlewares/authenticate';
import { validate } from '../middlewares/validators/validator';
import {
  getCalenderEventSchema,
  getEventSchema,
  postEventSchema,
} from '../middlewares/validators/zod-schemas/events';

const router = Router();

/* eslint-disable @typescript-eslint/no-misused-promises */
router.post('/', authenticate, validate(postEventSchema), postEvent);
router.get('/:eventId', authenticate, validate(getEventSchema), getEvents);
router.get(
  '/calendar/:calendarId',
  authenticate,
  validate(getCalenderEventSchema),
  getCalendarEvents
);
/* eslint-disable @typescript-eslint/no-misused-promises */

export default router;
