import { Router } from "express";
import {
  googleConnectHandler,
  googleCallbackHandler,
} from "../controllers/calendar.js";

const router = Router();

router.get("/google/connect", googleConnectHandler);
router.get("/google/callback", googleCallbackHandler);

export default router;
