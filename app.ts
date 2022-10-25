import { NextFunction, Request, Response} from "express";
import express from 'express'
import createError from 'http-errors'
import AppMiddlewares from './middlewares'
import indexRouter from './routes/index'

const app = express();

// Add Middlewares, routes
AppMiddlewares(app);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (err: Error, _req: Request, res: , _next: NextFunction) {
  res.boom.notFound(err);
});

module.exports = app;

export default app
