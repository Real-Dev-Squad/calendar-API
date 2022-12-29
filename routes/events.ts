import { Router } from "express";
import { getCalendarEvents, getEvents, postEvent } from "../controllers/events";
import authenticate from "../middlewares/authenticate";
import { validate } from "../middlewares/validators/validator";
import { postEventSchema } from "../middlewares/validators/zod-schemas/events";

const router = Router();

/* eslint-disable @typescript-eslint/no-misused-promises */
router.post("/", authenticate, validate(postEventSchema), postEvent);
router.get("/:eventId", authenticate, getEvents);
router.get("/calendar/:calendarId", authenticate, getCalendarEvents);
/* eslint-enable @typescript-eslint/no-misused-promises */

export default router;
