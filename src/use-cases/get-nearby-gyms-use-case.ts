import { IGymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface IGetNearbyGymsRequest {
  userLatitude: number
  userLongitude: number
}

interface IGetNearbyGymsResponse {
  gyms: Gym[]
}

export class GetNearbyGymsUseCase {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: IGetNearbyGymsRequest): Promise<IGetNearbyGymsResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
