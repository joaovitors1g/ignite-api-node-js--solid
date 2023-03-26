import { CheckIn } from '@prisma/client'

import { ICheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

interface IValidateCheckInRequest {
  checkInId: string
}

interface IValidateCheckInResponse {
  checkIn: CheckIn | null
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    checkInId,
  }: IValidateCheckInRequest): Promise<IValidateCheckInResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckInCreationToNow = dayjs().diff(
      checkIn.created_at,
      'minute',
    )

    if (distanceInMinutesFromCheckInCreationToNow > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
