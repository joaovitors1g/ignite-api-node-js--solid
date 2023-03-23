import { IGymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface ICreateGymRequest {
  name: string
  description?: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface ICreateGymResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    name,
    description,
    phone,
    latitude,
    longitude,
  }: ICreateGymRequest): Promise<ICreateGymResponse> {
    const gym = await this.gymsRepository.create({
      name,
      description,
      phone,
      latitude,
      longitude,
    })

    return { gym }
  }
}
