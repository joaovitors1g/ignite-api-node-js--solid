import { CheckIn } from '@prisma/client'

import { ICheckInsRepository } from '@/repositories/check-ins-repository'

interface IGetUserCheckinsRequest {
  userId: string
  page: number
}

interface IGetUserCheckinsResponse {
  checkIns: CheckIn[]
}

export class GetUserCheckinsUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    userId,
    page,
  }: IGetUserCheckinsRequest): Promise<IGetUserCheckinsResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return {
      checkIns,
    }
  }
}
