const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogs = await api.get('/api/blogs')
  console.log(blogs.body)
  expect(blogs.body.length).toBe(2)
})

afterAll(() => {
  mongoose.connection.close()
})