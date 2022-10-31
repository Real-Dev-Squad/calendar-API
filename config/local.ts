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
    calendarApi: {
      baseUrl: "http://localhost:3000",
    },

    rCalUi: {
      baseUrl: "http://localhost:3000",
      routes: {
        calendar: "/",
      },
    },
  },

  providers: {
    googleOauth20: {
      authURI: "https://accounts.google.com/o/oauth2/auth",
      clientId: "681996750707-tjf0g557ophrehlpgvonvf6dgr6u63ps.apps.googleusercontent.com",
      clientSecret: "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",
    },
  },
};
