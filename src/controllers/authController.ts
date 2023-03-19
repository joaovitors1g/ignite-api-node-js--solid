import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUserUseCase } from '@/use-cases/factories/make-authenticate-user-use-case'

export class AuthController {
  static async authenticate(req: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })

    const { email, password } = registerBodySchema.parse(req.body)

    try {
      const authenticateUserUseCase = makeAuthenticateUserUseCase()

      await authenticateUserUseCase.execute({
        email,
        password,
      })
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.status(400).send({
          message: error.message,
        })
      }

      throw error
    }

    return reply.status(200).send()
  }
}
