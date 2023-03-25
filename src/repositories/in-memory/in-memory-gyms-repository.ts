import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { FindManyNearbyParams, IGymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements IGymsRepository {
  public gyms: Gym[] = []

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return this.gyms.filter((gym) => {
      const distanceInKm = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )

      return distanceInKm <= 10
    })
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.gyms
      .filter((gym) => gym.name.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((gym) => gym.id === id)

    return gym ?? null
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.gyms.push(gym)

    return gym
  }
}
