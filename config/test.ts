/**
 * Set the environment specific config in this file.
 * Defaults set from default.js
 */

export default {
  port: 3000,
  logs: {
    enableFileLogs: false,
    enableConsoleLogs: true,
  },

  services: {
    calendarApi: {
      baseUrl: "http://localhost:3000",
    },

    rCalUi: {
      baseUrl: "http://localhost:3000/api/v1/health",
      routes: {
        calendar: "/",
      },
    },
  },

  providers: {
    googleOauth20: {
      clientId: "clientId",
      clientSecret: "clientSecret",
    },
    microsoftOauth20: {
      clientId: "clientId",
      clientSecret: "clientSecret",
    },
  },
};
