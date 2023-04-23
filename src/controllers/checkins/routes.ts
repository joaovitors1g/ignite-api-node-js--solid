import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { CheckInController } from './checkinController'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/check-ins/history', CheckInController.history)
  app.get('/check-ins/metrics', CheckInController.metrics)

  app.post('/gyms/:gymId/check-ins', CheckInController.register)
  app.patch('/check-ins/:checkInId/validate', CheckInController.validate)
}
