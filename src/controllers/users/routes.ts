import { FastifyInstance } from 'fastify'
import { RegisterController } from './registerController'
import { AuthController } from './authController'
import { ProfileController } from './profileController'
import { verifyJwt } from '@/middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', RegisterController.register)
  app.post('/sessions', AuthController.authenticate)

  /** Authenticated Routes */
  app.get(
    '/me',
    {
      onRequest: verifyJwt,
    },
    ProfileController.get,
  )
}
