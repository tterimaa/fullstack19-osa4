const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('api tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
      
  test('remove a blog', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToDelete = blogsBefore[0]
      
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
      
    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter.length).toBe(helper.initialBlogs.length - 1)
      
    const ids = blogsAfter.map(blog => blog.id)
    expect(ids).not.toContain(blogToDelete.id)
  })
      
  test('test post', async () => {
    const blogsAtStart = await helper.blogsInDb()
      
    await api
      .post('/api/blogs')
      .send(helper.testBlog)
      .expect(200)
      
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(blogsAtStart.length + 1)
  })
      
  test('likes 0 if no value is given', async () => {
    const response = await api
      .post('/api/blogs')
      .send(helper.testBlogLikesNull)
      .expect(200)
      
    expect(response.body.likes).toBe(0)
  })
      
  test('expect 400 if no title or no url', async () => {
    await api
      .post('/api/blogs')
      .send(helper.blogWithoutTitle)
      .expect(400)
      
    await api
      .post('/api/blogs')
      .send(helper.blogWithoutUrl)
      .expect(400)
  })
      
  test('id is defined', async () => {
    const blogs = await api.get('/api/blogs')
          
    for(let blog of blogs.body) {
      expect(blog.id).toBeDefined()
    }
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })
  
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
  
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }
  
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
  
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
    
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()
  
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }
  
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    expect(result.body.error).toContain('`username` to be unique')
  
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
})


afterAll(() => {
  mongoose.connection.close()
})
