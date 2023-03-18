import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export class RegisterController {
  static async register(req: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(8),
    })

    const { name, email, password } = registerBodySchema.parse(req.body)

    await prisma.user.create({
      data: {
        name,
        email,
        password_hash: password,
      },
    })

    return reply.status(201).send()
  }
}
