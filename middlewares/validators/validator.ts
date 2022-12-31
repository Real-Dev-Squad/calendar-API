import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import Boom from "@hapi/boom";

const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err: any) {
      logger.info("Error while validating data", { error: err.stack });
      return res.boom(
        Boom.badRequest(
          `Error while validating data: ${err?.issues[0].message}`
        )
      );
    }
  };

export { validate };
