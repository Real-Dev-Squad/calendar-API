import { Request, Response } from 'express'

/**
 * Route used to get the health status of the server
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const getSelfData = (req: Request, res: Response): Response => {
  try {
    if (req.userData) {
      if (req.query.private) {
        return res.json(req.userData);
      }
      const {email, ...userData } = req.userData;
      return res.json(userData);
    }
    return res.boom.notFound("User doesn't exist");
  } catch (error) {
    logger.error(`Error while fetching user: ${error}`);
    return res.boom.badImplementation("An internal server error occurred");
  }
};

export {
  getSelfData
};
