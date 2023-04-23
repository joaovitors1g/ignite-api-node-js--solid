import { FastifyReply, FastifyRequest } from 'fastify'

export class TokenController {
  static async refresh(req: FastifyRequest, reply: FastifyReply) {
    await req.jwtVerify({
      onlyCookie: true,
    })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: req.user.sub,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: req.user.sub,
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
  }
}
