import winston, { format } from 'winston';
import config from 'config';
const { combine, timestamp, prettyPrint, errors, printf } = format;

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: String(config.get('logs.logLevel')),
    filename: 'logs/app.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: String(config.get('logs.logLevel')),
    handleExceptions: true,
    json: false,
    colorize: true,
    silent: process.env.NODE_ENV === 'test', // Disable logs in test env
  },
};

const formatOptions = {
  PRETTY: combine(...[timestamp(), prettyPrint()]),
  CUSTOM: combine(
    ...[
      timestamp(), // Add a timestamp to each log message
      errors({ stack: true }), // Display stack traces for errors
      printf(({ level, message, timestamp }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
      }),
    ]
  ),
  DEFAULT: undefined,
};

enum FormatType {
  DEFAULT = 'DEFAULT',
  PRETTY = 'PRETTY',
  CUSTOM = 'CUSTOM',
}
const formatType: FormatType = config.get('logs.formatType');

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
  format: formatOptions[`${formatType}`],
  transports: [
    ...(config.get('logs.enableFileLogs') === true
      ? [new winston.transports.File(options.file)]
      : []),
    ...(config.get('logs.enableConsoleLogs') === true
      ? [new winston.transports.Console(options.console)]
      : []),
  ],

  exitOnError: false, // do not exit on handled exceptions
});

export default logger;
