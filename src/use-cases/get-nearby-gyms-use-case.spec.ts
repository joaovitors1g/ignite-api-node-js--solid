import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { GetNearbyGymsUseCase } from './get-nearby-gyms-use-case'

describe('GetNearbyGymsUseCase', () => {
  let gymsRepository: InMemoryGymsRepository
  let sut: GetNearbyGymsUseCase

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new GetNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to get nearby gyms', async () => {
    await gymsRepository.create({
      name: 'Near Gym',
      phone: null,
      description: null,
      latitude: -25.445378,
      longitude: -49.191663,
    })

    await gymsRepository.create({
      name: 'Far Gym',
      phone: null,
      description: null,
      latitude: -25.345079,
      longitude: -49.071194,
    })

    const { gyms } = await sut.execute({
      userLatitude: -25.4329826,
      userLongitude: -49.2679787,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        name: 'Near Gym',
      }),
    ])
  })
})
