import { NextFunction, Request, Response} from "express";
import express from 'express'
import createError from 'http-errors'
import AppMiddlewares from './middlewares'
import indexRouter from './routes/index'

// Initialise express
const app = express();

// Add Middlewares
AppMiddlewares(app);

// Add routes
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (err: Error, _req: Request, res: Response , _next: NextFunction) {
  res.boom.notFound(err.stack);
});

export default app
