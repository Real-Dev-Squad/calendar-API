import { Router } from 'express';
import {
  getSelfData,
  patchSelfData,
  usernameAvailability,
} from '../controllers/users';
import authenticate from '../middlewares/authenticate';
import { validate } from '../middlewares/validators/validator';
import {
  patchUserSelfSchema,
  usernameParamSchema,
} from '../middlewares/validators/zod-schemas/users';

const router = Router();

/**
 * @Todo: Need to look into this later.
 *  Current Error: "@typescript-eslint/no-misused-promises".
 *  Skiping the check for now as eslint expects a function of return type void for the "authenticate" middleware we are currently returning a Promise
 * */

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get('/self', authenticate, getSelfData);

router.patch(
  '/self',
  authenticate,
  validate(patchUserSelfSchema),
  patchSelfData
);

router.get(
  '/usernameCheck/:username',
  authenticate,
  validate(usernameParamSchema),
  usernameAvailability
);

export default router;
