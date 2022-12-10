import { Router } from "express";
import { postEvent } from "../controllers/events";
import authenticate from "../middlewares/authenticate";
import { validate } from "../middlewares/validators/validator";
import { postEventSchema } from "../middlewares/validators/zod-schemas/events";

const router = Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post("/", authenticate, validate(postEventSchema), postEvent);

export default router;
