import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

interface RegisterUserInput {
  name: string
  email: string
  password: string
}

export async function registerUserUseCase({
  name,
  email,
  password,
}: RegisterUserInput) {
  const userWithEmailCount = await prisma.user.count({
    where: {
      email,
    },
  })

  if (userWithEmailCount > 0) {
    throw new Error('User with this email already exists')
  }

  const passwordHash = await bcrypt.hash(password, 6)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: passwordHash,
    },
  })
}
