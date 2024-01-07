// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (user) => {
  cy.request('POST', 'http://localhost:3001/api/login', user)
  .then(({ body }) => {
    window.localStorage.setItem('loggedUser', JSON.stringify(body))
    cy.visit('http://localhost:5173')
  })
})

Cypress.Commands.add('addBlog', (blog) => {
  const token = window.localStorage.getItem('loggedUser')
  const config = {
    'Authorization': 'Bearer ' + JSON.parse(token).token
  }

  cy.request({
    method: 'POST',
    url: 'http://localhost:3001/api/blogs',
    body: blog,
    headers: config
  })

  cy.visit('http://localhost:5173')
})
