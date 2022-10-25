/**
 * Set the environment specific config in this file.
 * Defaults set from default.js
 */

module.exports = {
  enableFileLogs: false,
  enableConsoleLogs: true,

  integrations: {
    newrelic: {
      appName: "RCal_API_development",
    },
  },
};
