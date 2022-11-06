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
    enableFileLogs: false,
    enableConsoleLogs: true,
    logLevel: "http"
  },

  userAccessToken: {
    cookieName: `session-${String(NODE_ENV)}`,
    ttl: 30 * 24 * 60 * 60, // in seconds
    refreshTtl: 180 * 24 * 60 * 60, // in seconds
    publicKey: "-----BEGIN PUBLIC KEY-----\n" +
      "MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgH0apOTUQgD7pdgJ47HkB7r/1dkX\n" +
      "crYa/g1Lw5ax3S1KN6aQ070ZESX4xQdUIMfqZ1dLpyZ5yF2lPBYaKSB73ms8IkGe\n" +
      "fh1UePu5SYUep/H8mjTbuhS1Agmf+T4fsmoMBB8BIwGawJcC2qgIzlDHDsnr2lM/\n" +
      "0nMRSONlCxNZOQHvAgMBAAE=\n" +
      "-----END PUBLIC KEY-----",
    privateKey: "-----BEGIN RSA PRIVATE KEY-----\n" +
      "MIICWwIBAAKBgH0apOTUQgD7pdgJ47HkB7r/1dkXcrYa/g1Lw5ax3S1KN6aQ070Z\n" +
      "ESX4xQdUIMfqZ1dLpyZ5yF2lPBYaKSB73ms8IkGefh1UePu5SYUep/H8mjTbuhS1\n" +
      "Agmf+T4fsmoMBB8BIwGawJcC2qgIzlDHDsnr2lM/0nMRSONlCxNZOQHvAgMBAAEC\n" +
      "gYB3mM0iZThkMC6vhWTDXzd0sbcCPsRPCybsFw34Njk3Xsgs2C9Ti281Wckh5G8i\n" +
      "Lxhz/8LfqXS+8YOrrX67qy9JBh/V6X1A48KQC3ZKP8qgm2J1VULVgkWxPpjaRYLf\n" +
      "wDIQG7nop4nFHHc+7JWg3CnO4RMOPBK7nDEIqu5pEEENQQJBALzEJZM/V2VmqWZp\n" +
      "ZhHmULg2ulg6tIjgi2nAZppBWaZVvwJ54gJDf0D8iiqPCu5/nGtfjT4SQ05AnUG3\n" +
      "UA8zQgkCQQCpqbv3jcWFaIFvmWBaWvQoLqapHxBkPnDO7yRg7IX7Rc2f685wx080\n" +
      "RqQBkJiOjtajAc//KhUPSr4WrjZCk8I3AkAxc61oWvK5ZODCLKCJ1e2VpPjCfnan\n" +
      "WTQMu1Pl23LyCYqlymp0L1yaGM7VgW3at2GyG3E0LrKlQHYyLiTyJnqJAkEAjDcc\n" +
      "gyCFhxWxMxvcx4+3jKXRUp+7mj0IWdzFgdy3dcxgfbQR7p6pVJi03h40FkzyEdFj\n" +
      "pouO0A6DPpdHfIpEzQJAVqD9QcFRUDoLCTQFFBI6+hqFwix217uxs5Bj3aAxwzEr\n" +
      "j4lxE75KtmCLYQhI5D/ukKp8eyr1auih3960kw47gA==\n" +
      "-----END RSA PRIVATE KEY-----",
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
      databaseUrl: "<DATABASE_URL>",
    },
  },
};
