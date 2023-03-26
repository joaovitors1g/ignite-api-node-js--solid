import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CheckinUseCase } from '../check-in-use-case'

export function makeCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const gymRepository = new PrismaGymsRepository()

  const checkInUseCase = new CheckinUseCase(checkInRepository, gymRepository)

  return checkInUseCase
}
