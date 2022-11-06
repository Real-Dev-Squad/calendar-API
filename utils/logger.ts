import winston from "winston";
import config from "config";

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: String(config.get("logs.logLevel")),
    filename: "logs/app.log",
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: String(config.get("logs.logLevel")),
    handleExceptions: true,
    json: false,
    colorize: true,
    silent: process.env.NODE_ENV === "test", // Disable logs in test env
  },
};

// instantiate a new Winston Logger with the settings defined above
// eslint-disable-line new-cap
/* eslint new-cap: ["error", { "properties": false }] */
const logger: winston.Logger = winston.createLogger({
  /**
   * Application defaults:
   * - File logs enabled in: [production, staging]
   * - Console logs enabled in: [development]
   *
   * Modifications to be made through environment variables defined in config files
   */
  transports: [
    ...(config.get("logs.enableFileLogs") === true
      ? [new winston.transports.File(options.file)]
      : []),
    ...(config.get("logs.enableConsoleLogs") === true
      ? [new winston.transports.Console(options.console)]
      : []),
  ],

  exitOnError: false, // do not exit on handled exceptions
});

export default logger;
