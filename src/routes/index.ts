import { AuthController } from '@/controllers/authController'
import { RegisterController } from '@/controllers/registerController'
import { FastifyInstance } from 'fastify'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', RegisterController.register)
  app.post('/sessions', AuthController.authenticate)
}
