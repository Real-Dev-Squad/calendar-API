import { Router } from "express";
import {
  googleConnectHandler,
  googleCallbackHandler,
  getUserCalendar,
} from "../controllers/calendar";
import authenticate from "../middlewares/authenticate";
import { validate } from "../middlewares/validators/validator";
import { usernameParamSchema } from "../middlewares/validators/zod-schemas/users";

const router = Router();

router.get("/google/connect", googleConnectHandler);
router.get("/google/callback", googleCallbackHandler);

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get(
  "/:username",
  authenticate,
  validate(usernameParamSchema),
  getUserCalendar
);

export default router;
