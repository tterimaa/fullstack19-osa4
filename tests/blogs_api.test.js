const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

const testBlog = {
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
}

const testBlogLikesNull = {
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: ''
}

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('test post', async () => {
  const blogsAtStart = await helper.blogsInDb()

  await api
    .post('/api/blogs')
    .send(testBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toBe(blogsAtStart.length + 1)
})

test('likes 0 if no value is given', async () => {
  const response = await api
    .post('/api/blogs')
    .send(testBlogLikesNull)
    .expect(200)

  expect(response.body.likes).toBe(0)
})

test('id is defined', async () => {
  const blogs = await api.get('/api/blogs')
    
  for(let blog of blogs.body) {
    expect(blog.id).toBeDefined()
  }
})

afterAll(() => {
  mongoose.connection.close()
})