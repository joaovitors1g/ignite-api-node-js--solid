import { beforeEach, describe, expect, it } from 'vitest'
import bcryptjs from 'bcryptjs'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile-use-case'
import { ResourceNotFoundError } from './errors/resource-not-found'

describe('GetUserProfileUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: GetUserProfileUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await bcryptjs.hash('12345678', 6),
    })

    await sut.execute({
      userId: user.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() => {
      return sut.execute({
        userId: 'non-existing-user-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
