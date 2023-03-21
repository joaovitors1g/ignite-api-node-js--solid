import { User, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { IUsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements IUsersRepository {
  private users: User[] = []

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null
  }

  async exists(email: string): Promise<boolean> {
    return this.users.findIndex((user) => user.email === email) > -1
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }
}
