import { CheckIn } from '@prisma/client'

import { ICheckInsRepository } from '@/repositories/check-ins-repository'
import { IGymsRepository } from '@/repositories/gyms-repository'

import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

import { MaxDistanceError } from './errors/max-distance-error'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { MaxNumberOfCheckinsError } from './errors/max-number-of-checkins-error'

interface ICheckInRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface ICheckInResponse {
  checkIn: CheckIn
}

export class CheckinUseCase {
  constructor(
    private checkInsRepository: ICheckInsRepository,
    private gymsRepository: IGymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: ICheckInRequest): Promise<ICheckInResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KM = 0.1

    if (distance > MAX_DISTANCE_IN_KM) {
      throw new MaxDistanceError()
    }

    const checkInOnNowDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnNowDate) {
      throw new MaxNumberOfCheckinsError()
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}
