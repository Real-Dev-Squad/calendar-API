import { Router } from "express";
import health from "../controllers/health.js";

const router = Router();

router.get("/", health);

export default router;
