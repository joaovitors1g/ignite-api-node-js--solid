import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUserUseCase } from '../register-user-use-case'

export function makeRegisterUserUseCase() {
  const userRepository = new PrismaUsersRepository()

  const registerUserUseCase = new RegisterUserUseCase(userRepository)

  return registerUserUseCase
}
