import { beforeEach, describe, expect, it } from 'vitest'

import { SearchGymsUseCase } from './search-gyms-use-case'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

describe('SearchGymsUseCase', () => {
  let gymsRepository: InMemoryGymsRepository
  let sut: SearchGymsUseCase

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      name: 'BB Gym',
      phone: null,
      description: null,
      latitude: -25.4329826,
      longitude: -49.2679787,
    })

    await gymsRepository.create({
      name: 'Spartan Gym',
      phone: null,
      description: null,
      latitude: -25.4329826,
      longitude: -49.2679787,
    })

    const { gyms } = await sut.execute({
      query: 'Spartan',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        name: 'Spartan Gym',
      }),
    ])
  })

  it('should be able to get gyms search paginated', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        name: `Spartan Gym ${i}`,
        phone: null,
        description: null,
        latitude: -25.4329826,
        longitude: -49.2679787,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Spartan',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        name: 'Spartan Gym 21',
      }),
      expect.objectContaining({
        name: 'Spartan Gym 22',
      }),
    ])
  })
})
