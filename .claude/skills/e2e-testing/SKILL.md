---
name: e2e-testing
description: End-to-end testing frameworks, strategies, and automation for full application testing
---

# E2E Testing Skill


Expert knowledge of end-to-end testing with Playwright and Cypress.

## Playwright

### Setup
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
})
```

### Basic Test
```typescript
import { test, expect } from '@playwright/test'

test('user can log in', async ({ page }) => {
  await page.goto('/login')

  await page.fill('[name="email"]', 'user@example.com')
  await page.fill('[name="password"]', 'password123')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByText('Welcome back')).toBeVisible()
})
```

### Advanced Patterns

#### Page Object Model
```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.page.fill('[name="email"]', email)
    await this.page.fill('[name="password"]', password)
    await this.page.click('button[type="submit"]')
  }

  async expectLoggedIn() {
    await expect(this.page).toHaveURL('/dashboard')
  }
}

// test file
test('login flow', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login('user@example.com', 'password')
  await loginPage.expectLoggedIn()
})
```

#### Fixtures
```typescript
// fixtures.ts
export const test = baseTest.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login')
    await page.fill('[name="email"]', 'user@example.com')
    await page.fill('[name="password"]', 'password')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
    await use(page)
  }
})

// test file
test('view profile', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/profile')
  await expect(authenticatedPage.getByText('Profile')).toBeVisible()
})
```

### API Mocking
```typescript
test('handles API error gracefully', async ({ page }) => {
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Server error' })
    })
  })

  await page.goto('/users')
  await expect(page.getByText('Failed to load users')).toBeVisible()
})
```

## Cypress

### Basic Test
```typescript
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should log in successfully', () => {
    cy.get('[name="email"]').type('user@example.com')
    cy.get('[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/dashboard')
    cy.contains('Welcome back').should('be.visible')
  })

  it('should show error for invalid credentials', () => {
    cy.get('[name="email"]').type('wrong@example.com')
    cy.get('[name="password"]').type('wrong')
    cy.get('button[type="submit"]').click()

    cy.contains('Invalid credentials').should('be.visible')
  })
})
```

### Custom Commands
```typescript
// cypress/support/commands.ts
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('[name="email"]').type(email)
  cy.get('[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/dashboard')
})

// test file
cy.login('user@example.com', 'password')
```

## Best Practices

### Selectors

#### Good Selectors
```typescript
// Data attributes
page.getByTestId('submit-button')
cy.get('[data-testid="submit-button"]')

// ARIA roles
page.getByRole('button', { name: 'Submit' })
cy.get('button[aria-label="Submit"]')

// Labels
page.getByLabel('Email')
cy.get('label:contains("Email") input')
```

#### Bad Selectors
```typescript
// Avoid - Fragile, tied to implementation
page.locator('.btn-primary.large')
cy.get('div > div > button:nth-child(2)')
```

### Waiting and Assertions
```typescript
// Playwright - Built-in waiting
await expect(page.getByText('Success')).toBeVisible()
await page.waitForLoadState('networkidle')

// Cypress - Built-in retrying
cy.get('[data-testid="status"]').should('have.text', 'Complete')
cy.get('.loader').should('not.exist')
```

### Test Isolation

#### Reset State Between Tests
```typescript
// Playwright
test.beforeEach(async ({ page }) => {
  await page.context().clearCookies()
  await page.evaluate(() => localStorage.clear())
})

// Cypress
beforeEach(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
})
```

### Authentication State

#### Save Auth State (Playwright)
```typescript
// global-setup.ts
async function globalSetup() {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('/login')
  await page.fill('[name="email"]', 'user@example.com')
  await page.fill('[name="password"]', 'password')
  await page.click('button[type="submit"]')
  await page.context().storageState({ path: 'auth.json' })
  await browser.close()
}

// playwright.config.ts
export default defineConfig({
  globalSetup: './global-setup',
  use: {
    storageState: 'auth.json'
  }
})
```

## Testing Strategies

### Critical User Journeys
- User registration and onboarding
- Authentication (login, logout, password reset)
- Core features (e.g., create, read, update, delete)
- Checkout and payment flows
- Settings and profile management

### Visual Regression Testing
```typescript
// Playwright
await expect(page).toHaveScreenshot('homepage.png')

// Cypress with plugin
cy.matchImageSnapshot('homepage')
```

### Mobile Testing
```typescript
// Playwright
test('mobile navigation', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.click('[aria-label="Menu"]')
  await expect(page.getByRole('navigation')).toBeVisible()
})
```

## Debugging

### Playwright
```bash
# Run in headed mode
npx playwright test --headed

# Debug mode with inspector
npx playwright test --debug

# Show trace viewer
npx playwright show-trace trace.zip
```

### Cypress
```typescript
// Pause execution
cy.pause()

// Debug
cy.debug()

// Log to console
cy.log('Debug message')
```

## CI/CD Integration

### GitHub Actions
```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - name: Run Playwright tests
        run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Common Patterns

### File Upload
```typescript
// Playwright
await page.setInputFiles('input[type="file"]', 'path/to/file.pdf')

// Cypress
cy.get('input[type="file"]').attachFile('file.pdf')
```

### Drag and Drop
```typescript
// Playwright
await page.dragAndDrop('#source', '#target')
```

### Multiple Tabs
```typescript
// Playwright
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.click('a[target="_blank"]')
])
await newPage.waitForLoadState()
```
