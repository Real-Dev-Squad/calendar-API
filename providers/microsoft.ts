import passport from "passport";
import config from "config";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";

const MICROSOFT_AUTH_CALLBACK = "/api/v1/auth/microsoft/callback";

passport.use(
  new MicrosoftStrategy(
    {
      // Standard OAuth2 options
      clientID: config.get("providers.microsoftOauth20.clientId"),
      clientSecret: config.get("providers.microsoftOauth20.clientSecret"),
      callbackURL: `${String(
        config.get("services.calendarApi.baseUrl")
      )}${MICROSOFT_AUTH_CALLBACK}`,
      scope: ["user.read"],
    },
    (accessToken: string, _refreshToken: string, profile: any, cb: any) => {
      return cb(null, accessToken, profile);
    }
  )
);
