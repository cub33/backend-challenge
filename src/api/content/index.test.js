import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Content } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, content

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  content = await Content.create({})
})

test('POST /content 201 (admin)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession, name: 'test', type: 'test', src: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.name).toEqual('test')
  expect(body.type).toEqual('test')
  expect(body.src).toEqual('test')
})

test('POST /content 401 (user)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /content 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /content 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /content/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${content.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(content.id)
})

test('GET /content/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /content/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${content.id}`)
    .send({ access_token: adminSession, name: 'test', type: 'test', src: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(content.id)
  expect(body.name).toEqual('test')
  expect(body.type).toEqual('test')
  expect(body.src).toEqual('test')
})

test('PUT /content/:id 401 (user)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${content.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /content/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${content.id}`)
  expect(status).toBe(401)
})

test('PUT /content/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: adminSession, name: 'test', type: 'test', src: 'test' })
  expect(status).toBe(404)
})

test('DELETE /content/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${content.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /content/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${content.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /content/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${content.id}`)
  expect(status).toBe(401)
})

test('DELETE /content/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
