import express from "express";
import cookieParser from "cookie-parser";
import boom from "express-boom";
import helmet from "helmet";
import cors from "cors";
import morganMiddleware from "../utils/httpLogger";

const middleware = (app: express.Application): void => {
  // Middleware for sending error responses with express response object. To be required above all middlewares
  app.use(boom());

  // Initialise logging middleware
  app.use(morganMiddleware);

  // Request parsing middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Middleware to add security headers. Few headers have been disabled as it does not serve any purpose for the API.
  app.use(
    helmet({
      contentSecurityPolicy: false,
      dnsPrefetchControl: false,
      ieNoOpen: false,
      referrerPolicy: false,
      xssFilter: false,
    })
  );

  // Configure CORS
  app.use(
    cors({
      origin: config.get("cors.allowedOrigins"),
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );
};

export default middleware;
