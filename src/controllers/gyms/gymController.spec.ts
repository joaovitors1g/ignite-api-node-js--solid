import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUsers } from '@/utils/test/create-and-authenticate-users'
import request from 'supertest'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

describe('Gym Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  afterEach(async () => {
    await prisma.gym.deleteMany()
  })

  it('should be able to get create a gym', async () => {
    const { token } = await createAndAuthenticateUsers(app, true)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'My Awesome Gym',
        description: 'My Awesome Gym Description',
        phone: '43123456789',
        latitude: -25.4329826,
        longitude: -49.2679787,
      })

    expect(response.statusCode).toBe(201)
  })

  it('should be able to search gyms by name', async () => {
    const { token } = await createAndAuthenticateUsers(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'My Awesome Gym',
        description: 'My Awesome Gym Description',
        phone: '43123456789',
        latitude: -25.4329826,
        longitude: -49.2679787,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Muscle Gym',
        description: 'My Awesome Gym Description',
        phone: '43123456789',
        latitude: -25.4329826,
        longitude: -49.2679787,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'Muscle',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Muscle Gym',
        }),
      ]),
    )
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUsers(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Near Gym',
        description: 'Gym Description',
        phone: '43123456789',
        latitude: -25.445378,
        longitude: -49.191663,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Far Gym',
        description: 'Gym Description',
        phone: '43123456789',
        latitude: -25.345079,
        longitude: -49.071194,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -25.445378,
        longitude: -49.191663,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Near Gym',
        }),
      ]),
    )
  })
})
