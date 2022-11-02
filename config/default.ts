/**
 * Default config to be used if environment specific config for the specific key is absent
 * Every config key to be added to `default.js` to keep a track of all config keys used in the project.
 * Use placeholders as values wherever required.
 *
 * Documentation: https://github.com/lorenwest/node-config/wiki/Configuration-Files
 */

import { name } from "../package.json";

const NODE_ENV: string | undefined = process.env.NODE_ENV;
export default {
  port: 3000,
  logs: {
    enableFileLogs: true,
    enableConsoleLogs: false,
  },

  userAccessToken: {
    cookieName: `session-${String(NODE_ENV)}`,
    ttl: 30 * 24 * 60 * 60, // in seconds
    refreshTtl: 180 * 24 * 60 * 60, // in seconds
    publicKey: "<publicKey>",
    privateKey: "<privateKey>",
  },

  cors: {
    allowedOrigins: "*", // Docs: https://www.npmjs.com/package/cors#configuration-options
  },

  services: {
    calendarApi: {
      baseUrl: "<baseURL>",
    },

    rCalUi: {
      baseUrl: "<baseURL>",
      routes: {
        calendar: "/",
      },
    },
  },

  providers: {
    newrelic: {
      appName: `${name}_${String(NODE_ENV)}`,
      licenseKey: "<newrelicLicenseKey>",
    },
    googleOauth20: {
      clientId: "<clientId>",
      clientSecret: "<clientSecret>",
    },
    mySql: {
      username: "<MYSQL_USERNAME>",
      password: "<MYSQL_PASSWORD>",
      host: "<MYSQL_HOST>",
      name: "<MYSQL_NAME>"
    }
  },
};
