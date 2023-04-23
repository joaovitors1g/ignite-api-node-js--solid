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

      const { user } = await authenticateUserUseCase.execute({
        email,
        password,
      })

      const token = await reply.jwtSign(
        {
          role: user.role,
        },
        {
          sign: {
            sub: user.id,
          },
        },
      )

      const refreshToken = await reply.jwtSign(
        {
          role: user.role,
        },
        {
          sign: {
            sub: user.id,
            expiresIn: '7d',
          },
        },
      )

      return reply
        .status(200)
        .setCookie('refreshToken', refreshToken, {
          path: '/',
          httpOnly: true,
          secure: true, // process.env.NODE_ENV === 'production'
          sameSite: true,
        })
        .send({
          token,
        })
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.status(400).send({
          message: error.message,
        })
      }

      throw error
    }
  }
}
