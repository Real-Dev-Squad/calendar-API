/**
 * Default config to be used if environment specific config for the specific key is absent
 * Every config key to be added to `default.js` to keep a track of all config keys used in the project.
 * Use placeholders as values wherever required.
 *
 * Documentation: https://github.com/lorenwest/node-config/wiki/Configuration-Files
 */

const NODE_ENV = process.env.NODE_ENV;
export default {
  port: 3000,
  enableFileLogs: true,
  enableConsoleLogs: false,

  userAccessToken: {
    cookieName: `session-${NODE_ENV}`,
    ttl: 30 * 24 * 60 * 60, // in seconds
    refreshTtl: 180 * 24 * 60 * 60, // in seconds
    publicKey: "<publicKey>",
    privateKey: "<privateKey>",
  },

  integrations: {
    newrelic: {
      appName: "RCal_API_production",
      licenseKey: "<newrelicLicenseKey>",
    },
  }
};
