import { describe, expect, it } from 'vitest'
import bcryptjs from 'bcryptjs'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUserUseCase } from './authenticate-user-use-case'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'

describe('AuthenticateUserUseCase', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()

    const sut = new AuthenticateUserUseCase(usersRepository)

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await bcryptjs.hash('12345678', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '12345678',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository()

    const sut = new AuthenticateUserUseCase(usersRepository)

    await expect(() => {
      return sut.execute({
        email: 'johndoe@example.com',
        password: '12345678',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()

    const sut = new AuthenticateUserUseCase(usersRepository)

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await bcryptjs.hash('12345678', 6),
    })

    await expect(() => {
      return sut.execute({
        email: 'johndoe@example.com',
        password: '12345679',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})