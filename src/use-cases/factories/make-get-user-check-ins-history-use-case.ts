import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetUserCheckinsUseCase } from '../get-user-check-ins-history'

export function makeGetUserCheckInsHistoryUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()

  const getUserCheckInsHistoryUseCase = new GetUserCheckinsUseCase(
    checkInRepository,
  )

  return getUserCheckInsHistoryUseCase
}
