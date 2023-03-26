import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { SearchGymsUseCase } from '../search-gyms-use-case'

export function makeSearchGymsUseCase() {
  const gymRepository = new PrismaGymsRepository()

  const searchGymsUseCase = new SearchGymsUseCase(gymRepository)

  return searchGymsUseCase
}
