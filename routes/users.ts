import { Router } from "express";
import { getSelfData } from "../controllers/users";
import authenticate from "../middlewares/authenticate";

const router = Router();

// eslint-disable-next-line
router.get("/self", authenticate, getSelfData);

export default router;
