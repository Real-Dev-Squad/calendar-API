import { Router } from 'express';
import {
  getCalendarEvents,
  getEvents,
  postEvent,
  patchEvent,
} from '../controllers/events';
import authenticate from '../middlewares/authenticate';
import { validate } from '../middlewares/validators/validator';
import {
  getCalenderEventSchema,
  getEventSchema,
  postEventSchema,
  patchEventSchema,
} from '../middlewares/validators/zod-schemas/events';
import {
  calendarBelongsToUser,
  eventBelongsToUser,
} from '../middlewares/authorize';

const router = Router();

/* eslint-disable @typescript-eslint/no-misused-promises */
router.post(
  '/',
  authenticate,
  validate(postEventSchema),
  calendarBelongsToUser,
  postEvent
);
router.patch(
  '/:eventId',
  authenticate,
  validate(patchEventSchema),
  eventBelongsToUser,
  patchEvent
);
router.get(
  '/:eventId',
  authenticate,
  validate(getEventSchema),
  eventBelongsToUser,
  getEvents
);
router.get(
  '/calendar/:calendarId',
  authenticate,
  validate(getCalenderEventSchema),
  calendarBelongsToUser,
  getCalendarEvents
);
/* eslint-disable @typescript-eslint/no-misused-promises */

export default router;
