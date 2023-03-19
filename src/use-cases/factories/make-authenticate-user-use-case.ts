import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
import { AuthenticateUserUseCase } from '../authenticate-user-use-case'

export function makeAuthenticateUserUseCase() {
  const userRepository = new PrismaUsersRepository()

  const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository)

  return authenticateUserUseCase
}
