import { GoogleOAuthJson } from '../types/providers'
import prisma from '../prisma/prisma'

const loginOrSignupWithGoogle = async (googleProfile: GoogleOAuthJson) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: googleProfile?.email,
        googleProfileId: googleProfile?.sub
      },
    })

    if (user) {

    }

  } catch (err) {
    logger.error("loginOrSignupWithGoogle:: Error in authenticating user", { err })
  }
}

export {
  loginOrSignupWithGoogle
}
