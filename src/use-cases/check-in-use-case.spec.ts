import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckinUseCase } from './check-in-use-case'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime'

describe('AuthenticateUserUseCase', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let gymsRepository: InMemoryGymsRepository
  let sut: CheckinUseCase

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckinUseCase(checkInsRepository, gymsRepository)

    gymsRepository.gyms.push({
      id: 'gym-01',
      name: '',
      description: '',
      phone: '',
      latitude: new Decimal(-25.4329826),
      longitude: new Decimal(-49.2679787),
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
    }).rejects.toBeInstanceOf(Error)
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
    gymsRepository.gyms.push({
      id: 'gym-02',
      name: '',
      description: '',
      phone: '',
      latitude: new Decimal(-25.5550806),
      longitude: new Decimal(-49.1749382),
    })

    await expect(() => {
      return sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -25.4329826,
        userLongitude: -49.2679787,
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
