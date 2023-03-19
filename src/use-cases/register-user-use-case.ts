import { IUsersRepository } from '@/repositories/users-repository'
import bcrypt from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/users-already-exists-error'

interface RegisterUserInput {
  name: string
  email: string
  password: string
}

export class RegisterUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ name, email, password }: RegisterUserInput) {
    const emailInUse = await this.usersRepository.exists(email)

    if (emailInUse) {
      throw new UserAlreadyExistsError()
    }

    const passwordHash = await bcrypt.hash(password, 6)

    await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })
  }
}
