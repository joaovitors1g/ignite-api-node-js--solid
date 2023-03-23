import { ICheckInsRepository } from '@/repositories/check-ins-repository'
import { IGymsRepository } from '@/repositories/gyms-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found'

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
      throw new Error('User is too far from gym')
    }

    const checkInOnNowDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnNowDate) {
      throw new Error('User already checked in')
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
