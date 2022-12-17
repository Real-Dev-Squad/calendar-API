import express from "express";
import health from "./health.js";
import auth from "./auth.js";
import users from "./users.js";
import calendar from "./calendar.js";

const app = express();

app.use("/auth", auth);
app.use("/health", health);
app.use("/users", users);
app.use("/calendar", calendar);

export default app;
