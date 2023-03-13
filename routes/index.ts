import express from "express";
import health from "./health";
import auth from "./auth";
import users from "./users";
import calendar from "./calendar";

const app = express();

app.use("/auth", auth);
app.use("/health", health);
app.use("/users", users);
app.use("/calendar", calendar);

export default app;
