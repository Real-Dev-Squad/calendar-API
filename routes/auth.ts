import { Router } from 'express';
import {
  googleAuthCallback,
  microsoftAuthCallback,
  logOut,
  googleAuthLogin,
} from '../controllers/auth';
import passport from 'passport';

const router = Router();

router.get('/google/login', googleAuthLogin);

router.get('/google/callback', googleAuthCallback);

router.get('/logout', logOut);

router.get(
  '/microsoft/login',
  passport.authenticate('microsoft', {
    prompt: 'select_account',
  })
);

router.get('/microsoft/callback', microsoftAuthCallback);

export default router;
