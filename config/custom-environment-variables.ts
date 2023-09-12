/**
 * Contains environment variable mapping to the config key
 * The config values are overridden from the specified values in default.js or <env_name>.js
 * if the specified environment variable exists
 *
 * Documentation: https://github.com/lorenwest/node-config/wiki/Environment-Variables
 */
module.exports = {
  port: {
    __name: 'PORT',
    __format: 'number',
  },

  logs: {
    enableFileLogs: {
      __name: 'LOGS_ENABLE_FILE_LOGS',
      __format: 'boolean',
    },
    enableConsoleLogs: {
      __name: 'LOGS_ENABLE_CONSOLE_LOGS',
      __format: 'boolean',
    },
    formateType: 'LOGS_FORMAT_TYPE',
    logLevel: 'LOGS_LOG_LEVEL',
  },

  userAccessToken: {
    cookieName: 'USER_TOKEN_COOKIE_NAME',
    cookieDomain: 'USER_TOKEN_COOKIE_DOMAIN',
    ttl: {
      __name: 'USER_TOKEN_TTL',
      __format: 'number',
    },
    refreshTtl: {
      __name: 'USER_TOKEN_REFRESH_TTL',
      __format: 'number',
    },
    publicKey: 'PUBLIC_KEY',
    privateKey: 'PRIVATE_KEY',
  },

  cors: {
    allowedOrigins: 'CORS_ALLOWEDORIGINS',
  },

  services: {
    calendarApi: {
      baseUrl: 'SERVICES_CALENDARAPI_BASEURL',
    },

    rCalUi: {
      baseUrl: 'SERVICES_RCALUI_BASEURL',
    },
  },

  providers: {
    newrelic: {
      appName: 'PROVIDERS_NEWRELIC_APPNAME',
      licenseKey: 'PROVIDERS_NEWRELIC_LICENSEKEY',
    },
    googleOauth20: {
      clientId: 'PROVIDERS_GOOGLEOAUTH20_CLIENTID',
      clientSecret: 'PROVIDERS_GOOGLEOAUTH20_CLIENTSECRET',
    },
    microsoftOauth20: {
      clientId: 'PROVIDERS_MICROSOFTOAUTH20_CLIENTID',
      clientSecret: 'PROVIDERS_MICROSOFTOAUTH20_CLIENTSECRET',
    },
    mySql: {
      databaseUrl: 'DATABASE_URL',
    },
  },
};
