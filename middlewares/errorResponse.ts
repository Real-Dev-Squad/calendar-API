import { NextFunction, Request, Response } from 'express'
import { Payload } from '@hapi/boom'
import { apiResponse } from '../@types/apiReponse'

/**
 * Creates the error response and sends in the apiResponse format
 * @param {Object} _req
 * @param {Object} res
 * @param {Function} next
 */
const createErrorResponse = (_req: Request, res: Response, next: NextFunction) => {
  res.boom = (boomError: any): Response => {
    let boomResponse: Payload

    if (boomError.isBoom) {
      // converting boom response to required status type
      boomResponse = {
        ...boomError.output.payload,
        ...boomError.data
      }
    } else {
      // input boomResponse is simple string or any different object, sending 400
      boomResponse = {
        statusCode: 500,
        error: boomError,
        message: 'Internal Server Error'
      }
    }

    // Construct the response object
    const response: apiResponse<any> = {
      error: boomResponse
    }

    return res.status(boomResponse.statusCode).send(response)
  }
  return next()
}

export default createErrorResponse
