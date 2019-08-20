const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  }
]

const testBlogLikesNull = {
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: ''
}

const testBlog = {
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7
}


const blogWithoutTitle = {
  title: '',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 1
}
  
const blogWithoutUrl = {
  title: 'Title',
  author: 'Michael Chan',
  url: '',
  likes: 1
}

const idOfFirstBlog = () => {
  return initialBlogs[0]._id
}

// const nonExistingId = async () => {
//     const blog = new blog({ 
//         title: 'willremovethissoon',
//         author: 'aku ankka',
//         url: 'example.com',
//         likes: 1 
//     })
//     await blog.save()
//     await blog.remove()
  
//     return blog._id.toString()
//   }

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  const json = blogs.map(blog => blog.toJSON())
  return json
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  blogsInDb,
  initialBlogs,
  testBlog,
  blogWithoutTitle,
  blogWithoutUrl,
  testBlogLikesNull,
  usersInDb
}