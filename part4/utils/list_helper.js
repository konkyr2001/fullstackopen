const lodash = require('lodash')
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let element = blogs.map(element => element.likes)
  return element.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length == 0)
    return []
  let maxLikes = 0
  let maxIndex = 0
  blogs.forEach((element, index) => {
    if (element.likes > maxLikes) {
      maxLikes = element.likes
      maxIndex = index
    }
  });

  return blogs[maxIndex]

}

const mostBlogs = (blogs) => {
  if (blogs.length == 0) {
    return []
  }
  let object = []
  blogs.forEach(element => {
    let index = object.indexOf(object.find(obj => element.author == obj.author))
    if (index == -1) {
      object.push({
        author: element.author,
        blogs: 1
      })
    } else {
      object[index].blogs += 1
    }
  })

  let maxValue = 0
  let maxIndex = 0
  object.forEach((element, index) => {
    if (element.blogs > maxValue) {
      maxValue = element.blogs
      maxIndex = index
    }
  })
  return object[maxIndex]
}

const mostLikes = (blogs) => {
  if (blogs.length == 0) {
    return []
  }
  let object = []
  blogs.forEach(element => {
    let index = object.indexOf(object.find(obj => element.author == obj.author))
    if (index == -1) {
      object.push({
        author: element.author,
        likes: element.likes
      })
    } else {
      object[index].likes += element.likes
    }
  })

  let maxValue = 0
  let maxIndex = 0
  object.forEach((element, index) => {
    if (element.likes > maxValue) {
      maxValue = element.likes
      maxIndex = index
    }
  })
  return object[maxIndex]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}