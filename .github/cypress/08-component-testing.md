# Cypress Component Testing

> **Part of:** [Cypress Instructions](../copilot-instructions.md)

This guide covers best practices for writing Cypress component tests using `cy.mount()`.

## Spec File Placement

Component test specs live alongside the component source code, not inside the `cypress/e2e/` directory. Use the `cy.jsx` or `.cy.tsx` extension.

```bash
src/
  components/
    ChatMessage/
      ChatMessage.jsx        # Component source
      ChatMessage.cy.jsx     # Component test spec
```

The `specPattern` for component tests is configured in `cypress.config.js`:

```js
component: {
  specPattern: "src/**/*.cy.{js,jsx}",
  devServer: {
    framework: "react",
    bundler: "vite",
  },
},
```

## Mounting Components

Use `cy.mount()` to render a component in isolation. Pass props directly.

```js
import React from 'react'
import { MyComponent } from './MyComponent'

describe('<MyComponent />', () => {
  it('renders with default props', () => {
    cy.mount(<MyComponent />)

    cy.contains('Expected text').should('be.visible')
  })

  it('renders with custom props', () => {
    cy.mount(<MyComponent title="Custom" count={5} />)

    cy.contains('Custom').should('be.visible')
  })
})
```

## Wrapping with Providers and Routers

Components that depend on React context (e.g., `MemoryRouter`, theme providers) must be wrapped when mounting:

```typescript
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { ChatView } from './ChatView'

describe('<ChatView />', () => {
  it('renders the chat UI', () => {
    cy.mount(
      <MemoryRouter>
        <ChatView />
      </MemoryRouter>
    )

    cy.get('[data-testid="question-input"]').should('be.visible')
  })
})
```

## Intercepting API Calls

Component tests can use `cy.intercept()` just like E2E tests. Set up intercepts in `beforeEach` before mounting:

```js
describe('<ChatView />', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/models', {
      statusCode: 200,
      body: { api: { submodels: ['commands'] } },
    }).as('getModels')

    cy.intercept('GET', '/health', {
      statusCode: 200,
      body: { status: 'ok' },
    }).as('healthCheck')
  })

  it('renders with mocked data', () => {
    cy.mount(
      <MemoryRouter>
        <ChatView />
      </MemoryRouter>
    )

    cy.get('[data-testid="question-input"]').should('be.visible')
  })
})
```

## Key Differences from E2E Tests

- **No `cy.visit()`** — components are rendered via `cy.mount()`, not by navigating to a URL.
- **No `cy.sessionLogin()` or `cy.login()`** — component tests run in isolation. Mock auth context if needed.
- **Import the component directly** — use relative imports from the spec file to the component source.
- **Assertions and selectors** — all the same rules apply (AAA pattern, `data-testid`, `.should('be.visible')`, etc.).

## See Also

- [Test Organization](./02-test-organization.md) - AAA pattern and `context()` blocks
- [Selectors](./04-selectors.md) - Selector strategy
- [Assertions](./06-assertions.md) - Assertion best practices
