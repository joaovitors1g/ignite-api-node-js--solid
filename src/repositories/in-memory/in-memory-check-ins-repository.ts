import { CheckIn, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { ICheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  private checkIns: CheckIn[] = []

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const checkIn = this.checkIns.find(
      (checkIn) =>
        checkIn.user_id === userId &&
        checkIn.created_at.getDate() === date.getDate() &&
        checkIn.created_at.getMonth() === date.getMonth() &&
        checkIn.created_at.getFullYear() === date.getFullYear(),
    )

    return checkIn ?? null
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.checkIns.push(checkIn)

    return checkIn
  }
}
