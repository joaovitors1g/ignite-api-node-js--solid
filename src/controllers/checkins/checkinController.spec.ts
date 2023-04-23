import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUsers } from '@/utils/test/create-and-authenticate-users'
import request from 'supertest'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

describe('CheckIn Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  afterEach(async () => {
    await prisma.checkIn.deleteMany()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUsers(app)

    const gym = await prisma.gym.create({
      data: {
        name: 'My Awesome Gym',
        latitude: -25.4329826,
        longitude: -49.2679787,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -25.4329826,
        longitude: -49.2679787,
      })

    expect(response.statusCode).toBe(201)
  })

  it('should be able to get check-in history', async () => {
    const { token } = await createAndAuthenticateUsers(app)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        name: 'My Awesome Gym',
        latitude: -25.4329826,
        longitude: -49.2679787,
      },
    })

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    })

    const response = await request(app.server)
      .get(`/check-ins/history`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
    ])
  })

  it('should be able to get the total count of check-ins', async () => {
    const { token } = await createAndAuthenticateUsers(app)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        name: 'My Awesome Gym',
        latitude: -25.4329826,
        longitude: -49.2679787,
      },
    })

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    })

    const response = await request(app.server)
      .get(`/check-ins/metrics`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.checkInsCount).toEqual(2)
  })
  it('should be able to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUsers(app, true)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        name: 'My Awesome Gym',
        latitude: -25.4329826,
        longitude: -49.2679787,
      },
    })

    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(204)

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })
})
