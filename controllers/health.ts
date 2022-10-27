/**
 * Route used to get the health status of teh server
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
import { Request, Response } from "express";

const health = (_req: Request, res: Response): Response => {
  return res.json({
    uptime: process.uptime(),
  });
};

export default health;
