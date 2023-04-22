import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { GymController } from './gymController'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/gyms/search', GymController.search)
  app.get('/gyms/nearby', GymController.nearby)
  app.post('/gyms', GymController.register)
}
