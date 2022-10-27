import morgan, { StreamOptions } from "morgan";

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream: StreamOptions = {
  // Use the http severity
  write: (message: string) => logger.http(message),
};

// morgan middleware to stream HTTP logs to winston logger
const morganMiddleware = morgan("combined", { stream });

export default morganMiddleware;
