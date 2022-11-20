import { Users } from "@prisma/client";
import Boom from "express-boom";

declare global {
  namespace Express {
    interface Request {
      userData?: Users | null;
    }

    interface Response {
      boom?: Boom;
    }
  }
}
