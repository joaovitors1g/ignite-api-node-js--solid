import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetUserMetricsUseCase } from '../get-user-metrics-use-case'

export function makeGetUserMetricsUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()

  const getUserMetricsUseCase = new GetUserMetricsUseCase(checkInRepository)

  return getUserMetricsUseCase
}
