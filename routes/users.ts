import { Router } from "express";
import { getSelfData } from "../controllers/users";
import authenticate from "../middlewares/authenticate";

const router = Router();

/**
 * @Todo: Need to look into this later.
 *  Current Error: "@typescript-eslint/no-misused-promises".
 *  Skiping the check for now as eslint expects a function of return type void for the "authenticate" middleware we are currently returning a Promise
 * */
// eslint-disable-next-line
router.get("/self", authenticate, getSelfData);

export default router;
