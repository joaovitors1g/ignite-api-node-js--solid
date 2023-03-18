import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { registerUserUseCase } from '@/use-cases/register-use-case'

export class RegisterController {
  static async register(req: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(8),
    })

    const { name, email, password } = registerBodySchema.parse(req.body)

    try {
      await registerUserUseCase({
        name,
        email,
        password,
      })
    } catch (error) {
      return reply.status(400).send({
        message: (error as Error).message,
      })
    }

    return reply.status(201).send()
  }
}
