import { jwtSecret } from '@config/app'
import { Request } from '@customTypes/EraRequest'
import { NextFunction, Response } from 'express'
import { verify as JwtVerify } from 'jsonwebtoken'

export function checkJwt (request:Request, response:Response, next:NextFunction) {
  const token = request.headers.authorization.split(' ')[1]

  JwtVerify(token, jwtSecret, (err, decoded:{userId:number}) => {
    if (!err) {
      request.data = decoded
      next()
    } else {
      response.status(401).json({ error: true, message: err.message })
    }
  })
}
