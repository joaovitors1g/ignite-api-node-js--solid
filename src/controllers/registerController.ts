import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { RegisterUserUseCase } from '@/use-cases/register-user-use-case'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/users-already-exists-error'

export class RegisterController {
  static async register(req: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(8),
    })

    const { name, email, password } = registerBodySchema.parse(req.body)

    try {
      const usersRepository = new PrismaUsersRepository()
      const registerUserUseCase = new RegisterUserUseCase(usersRepository)

      await registerUserUseCase.execute({
        name,
        email,
        password,
      })
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        return reply.status(409).send({
          message: error.message,
        })
      }

      throw error
    }

    return reply.status(201).send()
  }
}
