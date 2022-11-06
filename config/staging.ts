/**
 * Set the environment specific config in this file.
 * Defaults set from default.js
 */

export default {
  logs: {
    enableFileLogs: false,
    enableConsoleLogs: true,
  },

  services: {
    rCalUi: {
      baseUrl: "https://rds-website-calendar.fly.dev",
    },
  },
};
