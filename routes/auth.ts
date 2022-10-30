import { Router } from "express";
import { googleAuth } from "../controllers/auth"

const router = Router();

router.get("/google/callback", googleAuth);

export default router;
