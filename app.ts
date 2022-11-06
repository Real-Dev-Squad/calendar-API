import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import AppMiddlewares from "./middlewares";
import indexRouter from "./routes/index";

// Initialise express
const app = express();

// Add Middlewares
AppMiddlewares(app);

// Add routes
app.use("/api/v1", indexRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, _res: Response, next: NextFunction) {
  logger.error(`API not found:: ${req.originalUrl}`);
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, _next: NextFunction) {
  logger.error(
    `Error handling the request:: ${req.originalUrl}, error:: `,
    err
  );

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const statusCode: number = err.status || 500;
  return res.boom.boomify(err, {
    statusCode,
    message: err.message,
  });
});

export default app;
