import { beforeEach, describe, expect, it } from 'vitest'
import bcryptjs from 'bcryptjs'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUserUseCase } from './authenticate-user-use-case'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('AuthenticateUserUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: AuthenticateUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUserUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
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
    await expect(() => {
      return sut.execute({
        email: 'johndoe@example.com',
        password: '12345678',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
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
