const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const Blogs = await Blog.find({})
  response.json(Blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if(blog) {
      response.json(blog.toJSON())
    } else {
      response.status(404).end()
    } 
  } catch (exception) {
    next(exception)
  }
})
  
blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  let blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0
  })

  if(!blog.title || !blog.url) {
    response.status(400).end()
  } else {
    try {
      const savedBlog = await blog.save()
      response.json(savedBlog.toJSON())
    } catch (exception) {
      next(exception)
    }
  }

})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  let blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0
  }
  try {
    const changedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.json(changedBlog.toJSON())
  } catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter