import { app } from '@/app'
import { createAndAuthenticateUsers } from '@/utils/test/create-and-authenticate-users'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Profile Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    const { token } = await createAndAuthenticateUsers(app)

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          email: 'johndoe@example.com',
        }),
      }),
    )
  })
})
