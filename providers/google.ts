import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

passport.use(new GoogleStrategy({
    clientID: config.get('providers.googleOauth20.clientId'),
    clientSecret: config.get('providers.googleOauth20.clientSecret'),
    callbackURL: `${config.get('services.calendarApi.baseUrl')}/api/v1/auth/google/callback`
  },
  (accessToken, _refreshToken, profile, cb) => {
    return cb(null, accessToken, profile)
  }
))
