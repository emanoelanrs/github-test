---
name: cypress-automation
description: "Expert rules for Cypress E2E and component test automation: selector strategy (data-testid over aria-label), no arbitrary waits (use cy.intercept and cy.wait with alias), AAA pattern, visibility over existence, API-based auth with cy.sessionLogin(). Use when writing or refactoring Cypress tests, debugging flaky tests, choosing selectors, setting up test setup/teardown, implementing authenticated test flows, or writing component tests with cy.mount. Triggers: Cypress, e2e test, component test, selector, flaky test, cy.session, cy.intercept, cy.mount."
---

# Skill: Cypress Automation Expert

You are an expert in web test automation using Cypress + JavaScript/TypeScript. Your goal is to write high-quality, deterministic, and maintainable E2E and component tests.

## When to Read Detailed Instructions

For detailed implementation guidance, code snippets, and extended examples, read from the [Cypress Instructions](../../copilot-instructions.md) topic files based on the task:

- **Setting up a new test file or project** → Read [01-project-structure.md](../../cypress/01-project-structure.md) and [02-test-organization.md](../../cypress/02-test-organization.md)
- **Implementing login or authentication** → Read [03-authentication.md](../../cypress/03-authentication.md)
- **Choosing selectors or reducing duplication** → Read [04-selectors.md](../../cypress/04-selectors.md)
- **Using cy.request, cy.wait, cy.intercept, or .last()** → Read [05-commands.md](../../cypress/05-commands.md)
- **Writing or debugging assertions** → Read [06-assertions.md](../../cypress/06-assertions.md)
- **Reviewing code quality, imports, or sensitive data handling** → Read [07-code-quality.md](../../cypress/07-code-quality.md)
- **Writing component tests with cy.mount** → Read [08-component-testing.md](../../cypress/08-component-testing.md)

## Core Principles

- **Test Independence:** Every test must be independent. Never set `testIsolation: false`
- **Deterministic Tests:** Tests must produce the same result every time. No conditional logic based on non-deterministic UI states
- **AAA Pattern:** Follow Arrange-Act-Assert structure with blank lines separating each phase

## Critical Rules

- **No Arbitrary Waits:** `cy.wait(Number)` is strictly forbidden. Use `cy.intercept()` + `cy.wait('@alias')`
- **No XPath:** Never use XPath selectors
- **Selector Priority:** `[data-testid]` > `[aria-label]` > descriptive attributes (e.g., `placeholder`) > `#id`
- **Visibility over Existence:** Use `.should('be.visible')` not `.should('exist')`
- **Auth via API:** Use `cy.sessionLogin()` for authenticated E2E tests (except login specs). This performs an API-based login, not a UI-based one.

## Essential Patterns

- Use **`beforeEach`** for setup. Avoid `before`, `after`, `afterEach`
- Use **`context()`** to organize sub-features within `describe()` blocks
- Use **`.as('alias')`** to avoid selector repetition
- Always **destructure** in `.then()` callbacks: `{ body, status }` for `cy.request()`, `{ response }` for `cy.wait('@alias')`
- For **`.last()`** elements, verify list length first
- For **negative assertions**, run a positive assertion first
- Use **`{ log: false }`** with sensitive data in `cy.env()` and `.type()`

## Examples

### Example 1: Writing a new E2E test for a form submission

User says: "Write a Cypress test for the contact form"

```js
describe('Contact Form', () => {
  beforeEach(() => {
    // Arrange
    cy.intercept('POST', '/api/contact').as('submitContact')
    cy.visit('/contact')
  })

  it('submits the form successfully', () => {
    // Act
    cy.get('[data-testid="name-input"]').type('Jane Doe')
    cy.get('[data-testid="email-input"]').type('jane@example.com')
    cy.contains('button', 'Submit').click()

    // Assert
    cy.wait('@submitContact').its('response.statusCode').should('equal', 200)
    cy.contains('h1', 'Thank you').should('be.visible')
  })
})
```

### Example 2: Fixing a flaky test that uses cy.wait(3000)

User says: "This test is flaky, it sometimes fails, while sometimes it passes"

Before (flaky):
```js
cy.get('[data-testid="save-btn"]').click()
cy.wait(3000)
cy.contains('.toast', 'Saved').should('be.visible')
```

After (deterministic):
```js
cy.intercept('PUT', '/api/save').as('save')
cy.get('[data-testid="save-btn"]').click()
cy.wait('@save')
cy.contains('.toast', 'Saved').should('be.visible')
```

### Example 3: Authenticated E2E test

User says: "Write a test that requires login"

```js
describe('Dashboard', () => {
  beforeEach(() => {
    cy.sessionLogin()
    cy.visit('/dashboard')
  })

  it('displays the welcome message', () => {
    cy.contains('h1', 'Welcome').should('be.visible')
  })
})
```

### Example 4: Component test with cy.mount

User says: "Write a component test for the Greeting component"

```js
import React from 'react'
import { Greeting } from './Greeting'

describe('<Greeting />', () => {
  it('renders the greeting text', () => {
    // Arrange
    cy.mount(<Greeting name="Alice" />)

    // Assert
    cy.contains('p', 'Hello, Alice!').should('be.visible')
  })

  context('when no name is provided', () => {
    it('renders a default greeting', () => {
      // Arrange
      cy.mount(<Greeting />)

      // Assert
      cy.contains('p', 'Hi, there!').should('be.visible')
    })
  })
})
```

## Troubleshooting

### Test passes locally but fails in CI

Likely causes: arbitrary wait, viewport difference, or missing intercept. Replace any `cy.wait(Number)` with `cy.intercept()` + `cy.wait('@alias')`. Check that the CI viewport matches expectations.

### Negative assertion passes when it shouldn't

A `should('not.exist')` assertion passes immediately if the page hasn't finished loading. Always run a positive assertion first to confirm you're in the expected state before asserting something is absent.

### Session not restored across specs

Ensure `cacheAcrossSpecs: true` is set in the `cy.session()` options and the session ID is consistent (typically the username).

### Component test fails with "cannot find module"

Ensure the component import path is relative to the spec file. Component specs live alongside the component source (e.g., `src/components/Foo/Foo.cy.tsx` imports `./Foo`).
