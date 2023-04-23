import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'
import { makeGetUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-get-user-check-ins-history-use-case'
import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'

export class CheckInController {
  static async register(req: FastifyRequest, reply: FastifyReply) {
    const createCheckInBodySchema = z.object({
      latitude: z.number().refine((value) => Math.abs(value) <= 90),
      longitude: z.number().refine((value) => Math.abs(value) <= 180),
    })

    const createCheckInParamsSchema = z.object({
      gymId: z.string().uuid(),
    })

    const { latitude, longitude } = createCheckInBodySchema.parse(req.body)

    const { gymId } = createCheckInParamsSchema.parse(req.params)

    const checkInUseCase = makeCheckInUseCase()

    await checkInUseCase.execute({
      gymId,
      userLatitude: latitude,
      userLongitude: longitude,
      userId: req.user.sub,
    })

    return reply.status(201).send()
  }

  static async history(req: FastifyRequest, reply: FastifyReply) {
    const checkInHistoryBodySchema = z.object({
      page: z.coerce.number().min(1).default(1),
    })

    const { page } = checkInHistoryBodySchema.parse(req.query)

    const getUserCheckInHistoryUseCase = makeGetUserCheckInsHistoryUseCase()

    const { checkIns } = await getUserCheckInHistoryUseCase.execute({
      page,
      userId: req.user.sub,
    })

    return reply.status(200).send({
      checkIns,
    })
  }

  static async metrics(req: FastifyRequest, reply: FastifyReply) {
    const getUserMetricsUseCase = makeGetUserMetricsUseCase()

    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: req.user.sub,
    })

    return reply.status(200).send({
      checkInsCount,
    })
  }

  static async validate(req: FastifyRequest, reply: FastifyReply) {
    const validateCheckInParamsSchema = z.object({
      checkInId: z.string().uuid(),
    })

    const { checkInId } = validateCheckInParamsSchema.parse(req.params)

    const checkInUseCase = makeValidateCheckInUseCase()

    await checkInUseCase.execute({
      checkInId,
    })

    return reply.status(204).send()
  }
}
