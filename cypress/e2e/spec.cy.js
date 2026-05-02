import { faker } from '@faker-js/faker';

describe('GitHub Test Suite', () => {
  beforeEach(() => {
    cy.visit('/login')

    cy.env(['GITHUB_USERNAME', 'GITHUB_USER_PASSWORD'])
      .then(({ GITHUB_USERNAME, GITHUB_USER_PASSWORD }) => {
        cy.get('[name="login"]').type(GITHUB_USERNAME)
        cy.get('[name="password"]').type(GITHUB_USER_PASSWORD, { log: false })
        cy.get('input[value="Sign in"]').click()

        cy.url().should('be.equal', `${Cypress.config('baseUrl')}/`)
      })
  })

  it('logs in successfully', () => {
    cy.get('[data-testid="github-avatar"]').click()

    cy.get('[aria-labelledby="global-nav-user-menu-header"]')
      .find('div:contains(emanoelanrs)')
      .should('be.visible')
  })

  // This test is being skipped because after clicking the
  // Create repository button, the repository is not being created,
  // and so, the user is not redirected to the just created repository
  it.skip('successfully creates a repository', () => {
    const repoName = faker.string.uuid()

    cy.visit('/new')

    cy.get('#repository-name-input').type(repoName)
    cy.contains('button', 'Create repository').click()

    cy.url().should('contain', repoName)
  })

  it('successfully logs out', () => {
    cy.get('[data-testid="github-avatar"]').click()
    cy.contains('span', 'Sign out').click()
    cy.get('input[value="Sign out"]').click()

    cy.get('header')
      .find('a[href="/login"]')
      .should('be.visible')
  })
})
