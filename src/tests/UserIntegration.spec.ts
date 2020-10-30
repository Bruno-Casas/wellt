import { Application } from 'express'
import request from 'supertest'
import * as cicle from './assets/testLifeCicleFunctions'

var app: Application
var authToken: string

beforeAll(cicle.beforeAll(data => {
  app = data.app
  authToken = data.token
}, true))
beforeEach(cicle.beforeEach)
afterAll(cicle.afterAll)

describe('Route test /user - User operations', () => {
  it('POST /user - Register user', async (done) => {
    const user = {
      username: 'testUser',
      email: 'user@example.com',
      password: 'Password@123'
    }

    const { body } = await request(app)
      .post('/user')
      .send(user)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)

    expect(body.username).toEqual('testUser')
    done()
  })

  it('POST /user - Register already disabled user', async (done) => {
    const user = {
      username: 'testUser2',
      email: 'user2@example.com',
      password: 'Password@123'
    }

    const { body } = await request(app)
      .post('/user')
      .send(user)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)

    expect(body.username).toEqual('testUser2')
    done()
  })

  it('POST /user - Register existing user', async (done) => {
    const user = {
      username: 'testUser1',
      email: 'testUser@example.com',
      password: 'Password@123'
    }

    const { body } = await request(app)
      .post('/user')
      .send(user)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(409)

    expect(body.error).toBe(true)
    done()
  })

  it('POST /user - Register user with invalid username', async (done) => {
    const user = {
      username: 'test User',
      email: 'testUser@example.com',
      password: 'Password@123'
    }

    const { body } = await request(app)
      .post('/user')
      .send(user)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422)

    expect(body.error).toBe(true)
    done()
  })

  it('GET /user - Get user', async (done) => {
    const { body } = await request(app)
      .get('/user')
      .set('authorization', `Bearer ${authToken}`)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(body).toBeTruthy()
    expect(body.username).toBe('testUser1')
    done()
  })

  it('DELETE /user - Delete/Disable user', async (done) => {
    request(app)
      .delete('/tools/1')
      .send({ password: 'Password@123' })
      .set('authorization', `Bearer ${authToken}`)
      .expect(204, done)
  })
})
