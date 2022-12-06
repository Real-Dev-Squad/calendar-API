import { Router } from "express";
import {
  googleConnectHandler,
  googleCallbackHandler,
} from "../controllers/calendar";

const router = Router();

router.get("/google/connect", googleConnectHandler);

// eslint-disable-next-line
router.get("/google/callback", googleCallbackHandler);

export default router;
