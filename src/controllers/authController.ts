import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
import { AuthenticateUserUseCase } from '@/use-cases/authenticate-user-use-case'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

export class AuthController {
  static async authenticate(req: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })

    const { email, password } = registerBodySchema.parse(req.body)

    try {
      const usersRepository = new PrismaUsersRepository()
      const authenticateUserUseCase = new AuthenticateUserUseCase(
        usersRepository,
      )

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
