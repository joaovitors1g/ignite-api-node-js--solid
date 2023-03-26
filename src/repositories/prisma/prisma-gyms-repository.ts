import { prisma } from '@/lib/prisma'
import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, IGymsRepository } from '../gyms-repository'

export class PrismaGymsRepository implements IGymsRepository {
  async findById(id: string): Promise<Gym | null> {
    const gym = prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async create(gym: Prisma.GymCreateInput): Promise<Gym> {
    const newGym = prisma.gym.create({
      data: gym,
    })

    return newGym
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = prisma.gym.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return gyms
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<Gym[]>`
SELECT * from gyms
WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10`
    return gyms
  }
}
