import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckinUseCase } from './check-in-use-case'

describe('AuthenticateUserUseCase', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let sut: CheckinUseCase

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckinUseCase(checkInsRepository)

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
    })

    console.log(checkIn.created_at)

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice a day', async () => {
    vi.setSystemTime(new Date('2022-01-20 8:00:00'))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    await expect(() => {
      return sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date('2022-01-20 8:00:00'))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    vi.setSystemTime(new Date('2022-01-21 8:00:00'))

    await expect(
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
      }),
    ).resolves.toBeTruthy()
  })
})
