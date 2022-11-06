import { Router } from "express";
import { googleAuthCallback } from "../controllers/auth";
import passport from "passport";

const router = Router();

router.get(
  "/google/login",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get("/google/callback", googleAuthCallback);

export default router;
