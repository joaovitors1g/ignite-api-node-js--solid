import { FastifyInstance } from 'fastify/types/instance'
import request from 'supertest'

export async function createAndAuthenticateUsers(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    email: 'johndoe@example.com',
    password: '12345678',
    name: 'John Doe',
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
