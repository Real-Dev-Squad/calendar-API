import config from "config";
import winston from "winston";

declare global {
  let config: config;
  let logger: winston.Logger;
}
