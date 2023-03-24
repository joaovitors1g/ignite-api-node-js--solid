import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckinUseCase } from './check-in-use-case'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { MaxNumberOfCheckinsError } from './errors/max-number-of-checkins-error'
import { MaxDistanceError } from './errors/max-distance-error'

describe('CheckInUseCase', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let gymsRepository: InMemoryGymsRepository
  let sut: CheckinUseCase

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckinUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      name: '',
      description: '',
      phone: '',
      latitude: -25.4329826,
      longitude: -49.2679787,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date('2022-01-20 8:00:00'))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -25.4329826,
      userLongitude: -49.2679787,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice a day', async () => {
    vi.setSystemTime(new Date('2022-01-20 8:00:00'))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -25.4329826,
      userLongitude: -49.2679787,
    })

    await expect(() => {
      return sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -25.4329826,
        userLongitude: -49.2679787,
      })
    }).rejects.toBeInstanceOf(MaxNumberOfCheckinsError)
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date('2022-01-20 8:00:00'))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -25.4329826,
      userLongitude: -49.2679787,
    })

    vi.setSystemTime(new Date('2022-01-21 8:00:00'))

    await expect(
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -25.4329826,
        userLongitude: -49.2679787,
      }),
    ).resolves.toBeTruthy()
  })

  it('should not be able to check in on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-02',
      name: '',
      description: '',
      phone: '',
      latitude: -25.5550806,
      longitude: -49.1749382,
    })

    await expect(() => {
      return sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -25.4329826,
        userLongitude: -49.2679787,
      })
    }).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
