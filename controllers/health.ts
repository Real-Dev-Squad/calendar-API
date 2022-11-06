import { Request, Response } from "express";
import { healthResponse } from "../@types/apiReponse";

/**
 * Route used to get the health status of the server
 *
 * @param _req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const health = (_req: Request, res: Response): Response => {
  const response: healthResponse = {
    uptime: process.uptime(),
  };

  return res.json(response);
};

export default health;
