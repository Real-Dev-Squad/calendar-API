import { Router } from "express";
import { googleAuthCallback, microsoftAuthCallback } from "../controllers/auth";
import passport from "passport";

const router = Router();

router.get(
  "/google/login",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get("/google/callback", googleAuthCallback);
router.get(
  "/microsoft/login",
  passport.authenticate("microsoft", {
    prompt: "select_account",
  })
);
router.get("/microsoft/callback", microsoftAuthCallback);

export default router;
