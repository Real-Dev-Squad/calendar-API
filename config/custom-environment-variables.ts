/**
 * Contains environment variable mapping to the config key
 * The config values are overridden from the specified values in default.js or <env_name>.js
 * if the specified environment variable exists
 *
 * Documentation: https://github.com/lorenwest/node-config/wiki/Environment-Variables
 */
module.exports = {
  port: {
    __name: "PORT",
    __format: "number",
  },

  logs: {
    enableFileLogs: {
      __name: "LOGS_ENABLE_FILE_LOGS",
      __format: "boolean",
    },
    enableConsoleLogs: {
      __name: "LOGS_ENABLE_CONSOLE_LOGS",
      __format: "boolean",
    },
  },

  userToken: {
    cookieName: "USER_TOKEN_COOKIE_NAME",
    ttl: {
      __name: "USER_TOKEN_TTL",
      __format: "number",
    },
    refreshTtl: {
      __name: "USER_TOKEN_REFRESH_TTL",
      __format: "number",
    },
    publicKey: "PUBLIC_KEY",
    privateKey: "PRIVATE_KEY",
  },


  integrations: {
    newrelic: {
      appName: "INTEGRATIONS_NEWRELIC_APPNAME",
      licenseKey: "INTEGRATIONS_NEWRELIC_LICENSEKEY",
    },
  },
};
