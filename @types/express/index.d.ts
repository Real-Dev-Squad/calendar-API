import { Users } from "@prisma/client";
import Boom from "express-boom"

declare global{
  namespace Express {
    interface Request {
      userData?: Users | null
    }

    // interface Boom {
    //
    //   notFound: (message?: string, data?: any) => BoomError;
    // }
    //
    // export interface BoomError {
    //   data: any;
    //   reformat: () => void;
    //   isBoom: boolean;
    //   isServer: boolean;
    //   message: string;
    //   output: Output;
    // }
    //
    // export interface Output {
    //   statusCode: number;
    //   headers: any;
    //   payload: any;
    // }

    interface Response {
      boom?: Boom
      // send: string
    }
  }
}

