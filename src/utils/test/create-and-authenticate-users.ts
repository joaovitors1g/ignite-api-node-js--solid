import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify/types/instance'
import request from 'supertest'

export async function createAndAuthenticateUsers(
  app: FastifyInstance,
  isAdmin = false,
) {
  await prisma.user.deleteMany()
  await prisma.user.create({
    data: {
      email: 'johndoe@example.com',
      name: 'John Doe',
      password_hash: await hash('12345678', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '12345678',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
