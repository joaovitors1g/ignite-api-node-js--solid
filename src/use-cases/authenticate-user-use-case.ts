import { IUsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface IAuthenticateUserRequest {
  email: string
  password: string
}

interface IAuthenticateUserResponse {
  user: User
}

export class AuthenticateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: IAuthenticateUserRequest): Promise<IAuthenticateUserResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const passwordMatch = await bcryptjs.compare(password, user.password_hash)

    if (!passwordMatch) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}
