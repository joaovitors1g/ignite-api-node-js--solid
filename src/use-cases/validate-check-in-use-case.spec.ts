import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in-use-case'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

describe('ValidateCheckInUseCase', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let sut: ValidateCheckInUseCase

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn?.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.checkIns[0].validated_at).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() => {
      return sut.execute({
        checkInId: 'inexistent-check-in-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of creation', async () => {
    vi.setSystemTime(new Date('2023-01-01 13:40:00'))
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutes = 21 * 60 * 1000

    vi.advanceTimersByTime(twentyOneMinutes)

    await expect(() => {
      return sut.execute({
        checkInId: createdCheckIn.id,
      })
    }).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
