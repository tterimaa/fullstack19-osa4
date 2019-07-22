const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = blogs => {
  return blogs.reduce((favorite, blog) => {
    return favorite.likes > blog.likes
      ? favorite
      : blog
  }, {})
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}