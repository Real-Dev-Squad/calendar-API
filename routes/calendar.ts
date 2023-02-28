import { Router } from "express";
import {
  googleConnectHandler,
  googleCallbackHandler,
  getUserCalendar,
  microsoftCallbackHandler,
  microsoftConnectHandler,
} from "../controllers/calendar";
import authenticate from "../middlewares/authenticate";
import { validate } from "../middlewares/validators/validator";
import { usernameParamSchema } from "../middlewares/validators/userSchema";

const router = Router();

router.get("/google/connect", googleConnectHandler);
router.get("/google/callback", googleCallbackHandler);
router.get("/microsoft/connect", authenticate, microsoftConnectHandler);
router.get("/microsoft/callback", authenticate, microsoftCallbackHandler);

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get(
  "/:username",
  authenticate,
  validate(usernameParamSchema),
  getUserCalendar
);

export default router;
