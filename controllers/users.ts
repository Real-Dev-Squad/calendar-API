import { Request, Response } from 'express'
import { Users } from '@prisma/client'

/**
 * Route used to get the health status of the server
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const getSelfData = (req: Request, res: Response) => {
  try {
    if (req.userData) {
      const fullUserDataAll: Users = req.userData
      const userData = {
        id: fullUserDataAll.id,
        email: fullUserDataAll.email,
        username: fullUserDataAll.username,
        firstname: fullUserDataAll.firstname,
        lastname: fullUserDataAll.lastname,
        bio: fullUserDataAll.bio,
        emailVerified: fullUserDataAll.emailVerified
      }

      return res.json(userData)
    }

    logger.info('User does not exist, as req.userData is empty')
    return res.boom.notFound('User doesn\'t exist')
  } catch (err) {
    logger.error('Error while fetching user', { err })
    return res.boom.badImplementation('An internal server error occurred')
  }
}

export {
  getSelfData
}
