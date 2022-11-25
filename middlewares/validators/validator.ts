import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

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
    } catch (error) {
      logger.info("Error while validating data", { error });
      return res.status(400).json(error);
    }
  };

export { validate };
