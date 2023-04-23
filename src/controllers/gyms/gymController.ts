import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'
import { makeGetNearbyGymsUseCase } from '@/use-cases/factories/make-get-nearby-gyms-use-case'

export class GymController {
  static async register(req: FastifyRequest, reply: FastifyReply) {
    const createGymBodySchema = z.object({
      name: z.string(),
      description: z.string().nullable(),
      phone: z.string(),
      latitude: z.number().refine((value) => Math.abs(value) <= 90),
      longitude: z.number().refine((value) => Math.abs(value) <= 180),
    })

    const { name, description, phone, latitude, longitude } =
      createGymBodySchema.parse(req.body)

    const createGymUseCase = makeCreateGymUseCase()

    await createGymUseCase.execute({
      name,
      description,
      phone,
      latitude,
      longitude,
    })

    return reply.status(201).send()
  }

  static async search(req: FastifyRequest, reply: FastifyReply) {
    const searchGymQuerySchema = z.object({
      q: z.string(),
      page: z.coerce.number().min(1).default(1),
    })

    const { q, page } = searchGymQuerySchema.parse(req.query)

    const searchGymsUseCase = makeSearchGymsUseCase()

    const { gyms } = await searchGymsUseCase.execute({
      query: q,
      page,
    })

    return reply.status(200).send({
      gyms,
    })
  }

  static async nearby(req: FastifyRequest, reply: FastifyReply) {
    const nearbyGymsQuerySchema = z.object({
      latitude: z.number().refine((value) => Math.abs(value) <= 90),
      longitude: z.number().refine((value) => Math.abs(value) <= 180),
    })

    const { latitude, longitude } = nearbyGymsQuerySchema.parse(req.query)

    const getNearbyGymsUseCase = makeGetNearbyGymsUseCase()

    const { gyms } = await getNearbyGymsUseCase.execute({
      userLatitude: latitude,
      userLongitude: longitude,
    })

    return reply.status(200).send({ gyms })
  }
}
