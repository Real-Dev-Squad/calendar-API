import jwt from 'jsonwebtoken'
import { GoogleOAuthJson } from '../@types/providers'
import prisma from '../prisma/prisma'
import { jwtPayload } from '../@types/services'
import { Users } from '@prisma/client'

/**
 * Generates the JWT
 *
 * @param payload {Object} - Payload to be added in the JWT
 * @return {String} - Generated JWT
 */
const generateAuthToken = (payload: jwtPayload): string => {
  return jwt.sign(payload, config.get('userToken.privateKey'), {
    algorithm: 'RS256',
    expiresIn: config.get('userToken.ttl')
  })
}

/**
 * Verifies if the JWT is valid. Throws error in case of signature error or expiry
 *
 * @param token {String} - JWT to be verified
 * @return {Object} - Decode value of JWT
 */
const verifyAuthToken = (token: string): any => {
  return jwt.verify(token, config.get('userToken.publicKey'), { algorithms: ['RS256'] })
}

/**
 * Decodes the JWT. This is irrespective of the signature error or expiry
 *
 * @param token {String} - JWT to be decoded
 * @return {Object} - Decode value of JWT
 */
const decodeAuthToken = (token: string) : any => {
  return jwt.decode(token)
}

const loginOrSignupWithGoogle = async (
  googleProfile: GoogleOAuthJson
): Promise<Users | undefined> => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: googleProfile?.email
      }
    })

    if (user) {
      return user
    } else {
      logger.info(`User with email ${googleProfile?.email} does not exist. Creating new account.`)
      const createdUser = await prisma.users.create({
        data: {
          email: googleProfile?.email,
          firstname: googleProfile?.given_name,
          lastname: googleProfile?.family_name,
          emailVerified: true,
          googleProfileId: googleProfile?.sub
        }
      })

      return createdUser
    }
  } catch (err) {
    logger.error('loginOrSignupWithGoogle:: Error in authenticating user', {
      err
    })

    return
  }
}

export {
  generateAuthToken,
  verifyAuthToken,
  decodeAuthToken,
  loginOrSignupWithGoogle
}
