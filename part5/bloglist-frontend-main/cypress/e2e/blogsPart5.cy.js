describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      username: 'kostas124',
      name: 'konkyr',
      password: 'kostas124'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)

    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
  })

  describe('login', function() {

    it('succeeds with correct credentials', function() {
      const user = {
        username: 'kostas124',
        name: 'konkyr',
        password: 'kostas124'
      }
      cy.login(user)
      cy.contains('kostas124 logged in')
    })

    it('fails with wrong credentials (+message)', function() {
      cy.get('#username-input').type('kostas')
      cy.get('#password-input').type('kostas')
      cy.contains('login').click()
      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      const user = {
        username: 'kostas124',
        name: 'konkyr',
        password: 'kostas124'
      }
      cy.login(user)
    })

    it('A blog can be created (+message)', function() {
      cy.contains('create new blog').click()

      cy.get('#title-input').type('title')
      cy.get('#author-input').type('author')
      cy.get('#url-input').type('url')

      cy.get('#create-button').click()

      cy.contains('Title: title Author: author')
      cy.contains('new blog title by author has been added')
    })

    describe('Blogs are posted', function() {
      beforeEach(function() {
        const blog = {
          author: 'author',
          title: 'title',
          url: 'url'
        }
        cy.addBlog(blog)
      })

      it('Users can like a blog', function() {
        cy.contains('Title: title Author: author').find('button').click()
        cy.contains('likes: 0')
        cy.contains('like').click()
        cy.contains('likes: 1')
      })

      it('The same user can delete the blog (+message)', function() {
        cy.contains('view').click()
        cy.contains('remove').click()
        cy.should('not.contain', 'Title: title Author: author')
        cy.contains('the blog title by author has been deleted')
      })

      describe('Another user logs in', function() {
        beforeEach(function()  {
          cy.contains('logout').click()
          const user = {
            username: 'user2',
            name: 'user',
            password: 'user2'
          }
          cy.request('POST', 'http://localhost:3001/api/users',user)
          cy.login(user)
        })

        it('users cant delete blogs from other users', function() {
          cy.contains('Title: title Author: author').find('button').click()
          cy.contains('kostas124')
          cy.should('not.contain', 'delete')
        })
      })

      describe('Many blogs are created', function() {
        beforeEach(function() {
          cy.addBlog({
            title: 'title1',
            author: 'author1',
            url: 'url1',
            likes: 10
          })
          cy.addBlog({
            title: 'title2',
            author: 'author2',
            url: 'url2',
            likes: 20
          })
        })

        it.only('Check if blogs are sorted according to likes', function() {
          cy.get('.blog').eq(0).contains('title2')
          cy.get('.blog').eq(1).contains('title1')
          cy.get('.blog').eq(2).contains('title')
        })
      })
    })
  })
})