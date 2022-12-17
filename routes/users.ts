import { Router } from "express";
import { getSelfData, patchSelfData } from "../controllers/users.js";
import authenticate from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validators/validator.js";
import { patchUserSelfSchema } from "../middlewares/validators/userSchema.js";

const router = Router();

/**
 * @Todo: Need to look into this later.
 *  Current Error: "@typescript-eslint/no-misused-promises".
 *  Skiping the check for now as eslint expects a function of return type void for the "authenticate" middleware we are currently returning a Promise
 * */

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get("/self", authenticate, getSelfData);
router.patch(
  "/self",
  authenticate,
  validate(patchUserSelfSchema),
  patchSelfData
);
/* eslint-enables @typescript-eslint/no-misused-promises */

export default router;
