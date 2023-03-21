import { ICheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'

interface ICheckInRequest {
  userId: string
  gymId: string
}

interface ICheckInResponse {
  checkIn: CheckIn
}

export class CheckinUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({ userId, gymId }: ICheckInRequest): Promise<ICheckInResponse> {
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
