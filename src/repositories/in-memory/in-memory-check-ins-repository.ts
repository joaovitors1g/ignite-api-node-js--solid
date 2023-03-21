import { CheckIn, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { ICheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  private checkIns: CheckIn[] = []

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
