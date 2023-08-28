/**
 * Default config to be used if environment specific config for the specific key is absent
 * Every config key to be added to `default.js` to keep a track of all config keys used in the project.
 * Use placeholders as values wherever required.
 *
 * Documentation: https://github.com/lorenwest/node-config/wiki/Configuration-Files
 */

import { name } from '../package.json';

const NODE_ENV: string | undefined = process.env.NODE_ENV;
export default {
  port: 3000,
  logs: {
    enableFileLogs: false,
    enableConsoleLogs: true,
    // [DEFAULT, PRETTY, SIMPLE, CUSTOM]
    formatType: 'DEFAULT',
    logLevel: 'http',
  },

  userAccessToken: {
    cookieName: `rcal-session`,
    cookieDomain: '<cookie-domain>',
    ttl: 30 * 24 * 60 * 60, // in seconds
    refreshTtl: 180 * 24 * 60 * 60, // in seconds
    publicKey:
      '-----BEGIN PUBLIC KEY-----\n' +
      'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvxfGsZdyqVHf7TQvgGY4\n' +
      '8laDAtUp067Oe4AeIASfT3EXOndTRVtGl8leJTPRUoUJ8SPIY41lz1w8jhKDX6PJ\n' +
      '7OvU+DBH09XfrX6Be5katb+OhcXUOg1jjn2qNyEgX7rlXPM0hbNmw4tZWjO5vs+B\n' +
      'BRBiFX5FlXLjNrAh/5MMfran+MdA1NUd1q8rGycEBKaA+bsrpGJqTpFhUIaob+ow\n' +
      'o1gKTu8oZlhK93kAxSqp21DarIQeYT67LC54CR1AjYnlT7p1/vaMR1GSJ4QdmfSO\n' +
      'APm4q/cTAZCaIilSISv9NkcSpLuy4ls1FVyiMqSVIxr5JZok/w+Eu8gohnudYe9/\n' +
      'nwIDAQAB\n' +
      '-----END PUBLIC KEY-----\n',
    privateKey:
      '-----BEGIN RSA PRIVATE KEY-----\n' +
      'MIIEpAIBAAKCAQEAvxfGsZdyqVHf7TQvgGY48laDAtUp067Oe4AeIASfT3EXOndT\n' +
      'RVtGl8leJTPRUoUJ8SPIY41lz1w8jhKDX6PJ7OvU+DBH09XfrX6Be5katb+OhcXU\n' +
      'Og1jjn2qNyEgX7rlXPM0hbNmw4tZWjO5vs+BBRBiFX5FlXLjNrAh/5MMfran+MdA\n' +
      '1NUd1q8rGycEBKaA+bsrpGJqTpFhUIaob+owo1gKTu8oZlhK93kAxSqp21DarIQe\n' +
      'YT67LC54CR1AjYnlT7p1/vaMR1GSJ4QdmfSOAPm4q/cTAZCaIilSISv9NkcSpLuy\n' +
      '4ls1FVyiMqSVIxr5JZok/w+Eu8gohnudYe9/nwIDAQABAoIBAQCBYsHgASFbz9oE\n' +
      'q+71y0EHpNf0FQzLDXM1X9wF5dtQWMxXg+/X6CN2JpweKGW0r+u5YHcQIO8sZdGC\n' +
      'iLp3CVlxl4SNv3MC1a8rs5pMa7AQG3GO1hIKdIJSOngD9+QJrWwbcXjAhmYwRKvt\n' +
      'TVSZA7riCOPAlczbkfySTNPYTmKJcEvYsNWYDN+FW6tEa2PSgVPMIr9EHAaHkIYA\n' +
      'wvpEa284BFayufZ6yDK9JSoDigvRBRUgQoxA1ZckGctkcjKfZg/ACBkf1HZiB0/z\n' +
      '0/LNDjT51ERPKGjBpKgNkzI3oAx65hQUBYjgnaf0exlR0rqSEeuwifhUI8qNTPz1\n' +
      'hCxr38UBAoGBAOIQx+15tE6ijzgdkEhJvfWYRDSwCvCtlH8C7uROxPcAtRSZ7i8a\n' +
      'GoxZYKXevNhir7/eBCRphwuc+LTevLDKiWYMvsgYBOm078FsKUby7rF9DIZpP5IG\n' +
      'IfgooFS6BkAXP5HscjExD3XU/5/eMT9GOdhm5ZY3fwtWlEllqjTDlehBAoGBANhl\n' +
      'e95FmFNQ0Ev5LWkSBwD4c5xIGisi4Tqt0QZT/xHyXmI0+5EjLCm7NPC1jWziw8ys\n' +
      'U0wW1lHwhL6v8mBUhNWr3fYnwb/65c1MZEXu9VOryL7/FjXp66D1Qjz/Si0SXlt/\n' +
      'LMJxzyRNjpoQiS/IJ1/YXlDIoAwBjJCeZ95JJm/fAoGAWdx3zIMbVEK0EYdW6hU+\n' +
      'CFkdi6AKyT8GjzJYSbKyAslqMaU6k8iZkv6YN3cBtDYOTINxPBQilVAxYJxFfzUT\n' +
      'Rth8IcfCdC/zOfzHr6czkKP3jZpapa4AZMepa+SCRYm4QEYv4jPxRFKFxkOpadB9\n' +
      'f/LvAjZPLu+chEyASvcQKMECgYAblKu6A8LLc7RoyoSYLL0JyaDqnWIAd3yffwHy\n' +
      'PYh4IB0ZhUk/EW2SkBLKT0mMREbScnBXdV2xqecxarmIv50CotoygpS2RGM/zGnH\n' +
      'ZBKOrIl0loydKIhoxnm/zoYEwp+WJ9prmhfdt6jiSBNELM2f8LLstvV3MkdZM2dn\n' +
      'tIkanwKBgQDV5UphnPmHdW8oibjXiqMXQDqMvXhpRqIK+dAIJDMRLU/8l5YwJgux\n' +
      'Ao1S47DhG/mt/r5pwAG72TJ3JidCpHx/2Tp0I0+v9JnZ9OvPYEQ2Akay5wnFtJ7w\n' +
      'nYPByMsv2Tin9UIHCbQpMnUZAxhNmXZyHySBqV7Nl0E0lBs908OSzA==\n' +
      '-----END RSA PRIVATE KEY-----\n',
  },

  cors: {
    allowedOrigins: '*', // Docs: https://www.npmjs.com/package/cors#configuration-options
  },

  services: {
    calendarApi: {
      baseUrl: '<baseURL>',
    },

    rCalUi: {
      baseUrl: '<baseURL>',
      routes: {
        calendar: '/',
      },
    },
  },

  providers: {
    newrelic: {
      appName: `${name}_${String(NODE_ENV)}`,
      licenseKey: '<newrelicLicenseKey>',
    },
    googleOauth20: {
      clientId: '<clientId>',
      clientSecret: '<clientSecret>',
    },
    microsoftOauth20: {
      clientId: '<clientId>',
      clientSecret: '<clientSecret>',
    },
    mySql: {
      databaseUrl: '<DATABASE_URL>',
    },
  },

  messages: {
    forbidden: 'You do not have permission to perform this action.',
  },
};
