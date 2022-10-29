import express from "express";
import health from "./health";

const app = express();

app.use("/health", health);

export default app;
