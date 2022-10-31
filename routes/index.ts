import express from "express";
import health from "./health";
import auth from './auth'

const app = express();

app.use("/auth", auth);
app.use("/health", health)

export default app;
