import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

passport.use(new GoogleStrategy({
    clientID: config.get('providers.googleOauth20.clientId'),
    clientSecret: config.get('providers.googleOauth20.clientSecret'),
    callbackURL: 'http://www.example.com/auth/google/callback'
  },
  (accessToken, _refreshToken, profile, cb) => {
    return cb(null, accessToken, profile)
  }
))
