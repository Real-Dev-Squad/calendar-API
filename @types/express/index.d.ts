import { Users } from "@prisma/client";

declare global{
  namespace Express {
    interface Request {
      userData?: Users | null
    }
  }
}

