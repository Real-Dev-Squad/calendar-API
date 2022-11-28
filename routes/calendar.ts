import { google } from "googleapis";
import { Request, Response, Router } from "express";

const router = Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GCAL_CLIENT_ID,
  process.env.GCAL_CLIENT_SECRET,
  // eslint-disable-next-line
  `${process.env.BASE_URL}/api/v1/calendar/google/callback`
);

const scopes = "https://www.googleapis.com/auth/calendar";

const googleConnectHandler = (_: Request, res: Response): void => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });

  res.redirect(url);
};

const googleCallbackHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const query = req.query as { code: string; scope: string };

  /**
   * Generate AccessTokens from Secret code
   * Note: We only get Refresh token when the user gives permission for the first time
   * */
  const { tokens } = await oauth2Client.getToken(query.code);

  res.json({
    data: {
      query,
      tokens,
    },
  });
};

router.get("/google/connect", googleConnectHandler);

// eslint-disable-next-line
router.get("/google/callback", googleCallbackHandler);

export default router;
