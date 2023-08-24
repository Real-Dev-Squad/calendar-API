import jwt from 'jsonwebtoken';
import { GoogleOAuthJson, MicrosoftOAuthJson } from '../@types/providers';
import prisma from '../prisma/prisma';
import { jwtPayload } from '../@types/services';
import { Calendar, Users } from '@prisma/client';

/**
 * Generates the JWT
 *
 * @param payload {Object} - Payload to be added in the JWT
 * @return {String} - Generated JWT
 */
const generateAuthToken = (payload: jwtPayload): string => {
  return jwt.sign(payload, config.get('userAccessToken.privateKey'), {
    algorithm: 'RS256',
    expiresIn: config.get('userAccessToken.ttl'),
  });
};

/**
 * Verifies if the JWT is valid. Throws error in case of signature error or expiry
 *
 * @param token {String} - JWT to be verified
 * @return {Object} - Decode value of JWT
 */
const verifyAuthToken = (token: string): any => {
  return jwt.verify(token, config.get('userAccessToken.publicKey'), {
    algorithms: ['RS256'],
  });
};

/**
 * Decodes the JWT. This is irrespective of the signature error or expiry
 *
 * @param token {String} - JWT to be decoded
 * @return {Object} - Decode value of JWT
 */
const decodeAuthToken = (token: string): any => {
  return jwt.decode(token);
};

/**
 *
 * Returns user details with calendarId
 * @param email string
 * @returns Promise<Users & { calendarId: number }
 */
const getUserData = async (
  email: string
): Promise<Users & { calendarId: number }> => {
  const user = await prisma.users.findUniqueOrThrow({
    where: {
      email,
    },
    include: {
      Calendar: {
        where: {
          isDeleted: false,
          isPrimary: true,
        },
        select: {
          id: true,
        },
      },
    },
  });
  return { ...user, calendarId: user.Calendar[0].id };
};

/**
 *
 * Creates new user in DB
 * @param user GoogleOAuthJson | MicrosoftOAuthJson
 * @returns Promise<{ user: Users; calendar: Calendar }
 */
const createNewUser = async (
  user: GoogleOAuthJson | MicrosoftOAuthJson
): Promise<{ user: Users; calendar: Calendar }> => {
  let createdUser: Users | undefined;

  if ('email' in user) {
    logger.info(
      `User with email ${user.email} does not exist. Creating new account from Google`
    );
    createdUser = await prisma.users.create({
      data: {
        email: user.email,
        firstname: user.given_name,
        lastname: user.family_name,
        emailVerified: true,
        googleProfileId: user?.sub,
      },
    });
  } else if ('mail' in user) {
    logger.info(
      `User with email ${user.mail} does not exist. Creating new account from Microsoft`
    );
    createdUser = await prisma.users.create({
      data: {
        email: user.mail ?? user.userPrincipalName,
        firstname: user.givenName,
        lastname: user.surname,
        emailVerified: true,
        microsoftProfileId: user.id,
      },
    });
  }

  if (!createdUser) {
    throw new Error('Failed to create user');
  }

  logger.info(`Creating users default calender.`);

  const createdCalendar = await prisma.calendar.create({
    data: {
      name: createdUser.email,
      ownerId: createdUser.id,
      isPrimary: true,
    },
  });

  return { user: createdUser, calendar: createdCalendar };
};

/**
 * Login or signUp with Google
 * @param googleProfile{Object} : Google profile response from Google OAuth2.0
 */
const loginOrSignupWithGoogle = async (
  googleProfile: GoogleOAuthJson
): Promise<Users & { calendarId: number }> => {
  try {
    const user = await getUserData(googleProfile.email);

    if (user) {
      return user;
    } else {
      const { user: createdUser, calendar: createdCalendar } =
        await createNewUser(googleProfile);

      return { ...createdUser, calendarId: createdCalendar.id };
    }
  } catch (err: any) {
    logger.error('loginOrSignupWithGoogle:: Error in authenticating user', {
      err,
    });

    throw new Error('');
  }
};

/**
 * Login or signUp with Microsoft
 * @param microsoftProfile{Object} : Microsoft profile response from Microsoft OAuth2.0
 */
const loginOrSignupWithMicrosoft = async (
  microsoftProfile: MicrosoftOAuthJson
): Promise<Users & { calendarId: number }> => {
  try {
    const user = await getUserData(
      microsoftProfile.mail ?? microsoftProfile?.userPrincipalName
    );

    if (user) {
      return user;
    } else {
      const { user: createdUser, calendar: createdCalendar } =
        await createNewUser(microsoftProfile);

      return { ...createdUser, calendarId: createdCalendar.id };
    }
  } catch (err: any) {
    logger.error('loginOrSignupWithGoogle:: Error in authenticating user', {
      err,
    });

    throw new Error('');
  }
};

export {
  generateAuthToken,
  verifyAuthToken,
  decodeAuthToken,
  loginOrSignupWithGoogle,
  loginOrSignupWithMicrosoft,
};
