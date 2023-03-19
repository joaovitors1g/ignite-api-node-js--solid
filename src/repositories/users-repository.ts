import { Prisma, User } from '@prisma/client'

export interface IUsersRepository {
  exists(email: string): Promise<boolean>
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}