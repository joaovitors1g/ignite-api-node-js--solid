import '@fastify/jwt'
import { Role } from '@prisma/client'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
      role: (typeof Role)[keyof typeof Role]
    } // user type is return type of `request.user` object
  }
}
