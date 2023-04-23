import { Role } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(neededRole: (typeof Role)[keyof typeof Role]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const { role } = req.user
    if (role !== neededRole) {
      return reply.status(403).send({
        message: 'Forbidden',
      })
    }
  }
}
