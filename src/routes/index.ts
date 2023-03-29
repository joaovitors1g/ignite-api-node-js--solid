import { AuthController } from '@/controllers/authController'
import { ProfileController } from '@/controllers/profileController'
import { RegisterController } from '@/controllers/registerController'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'

export async function appRoutes(app: FastifyInstance) {
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
