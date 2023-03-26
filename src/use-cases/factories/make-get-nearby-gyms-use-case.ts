import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { GetNearbyGymsUseCase } from '../get-nearby-gyms-use-case'

export function makeGetNearbyGymsUseCase() {
  const gymRepository = new PrismaGymsRepository()

  const getNearbyGymsUseCase = new GetNearbyGymsUseCase(gymRepository)

  return getNearbyGymsUseCase
}
