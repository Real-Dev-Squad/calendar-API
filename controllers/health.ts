import { Request, Response } from "express";
import { healthResponse } from "../types/apiReponse";
import prisma from '../prisma/prisma'

/**
 * Route used to get the health status of the server
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const health = async (_req: Request, res: Response): Promise<Response> => {

  const newUser = await prisma.user.create({
    data: {
      firstname: 'Alice',
      email: 'alice@prisma.io',
    },
  })

  logger.info("newuser:: ", {
    newUser
  })

  const response: healthResponse = {
    uptime: process.uptime(),
  };

  return res.json(response);
};

export default health;
