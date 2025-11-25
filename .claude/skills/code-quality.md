# Code Quality Skill

Expert knowledge of writing clean, maintainable, high-quality code.

## Clean Code Principles

### Meaningful Names
```typescript
// Bad: Unclear, abbreviated
const d = 86400000 // What is d?
function calc(a, b) { return a + b }

// Good: Clear, descriptive
const MILLISECONDS_PER_DAY = 86400000
function calculateTotalPrice(price: number, tax: number): number {
  return price + tax
}

// Variables: Noun phrases
const userCount = 10
const isAuthenticated = true

// Functions: Verb phrases
function fetchUser() {}
function validateEmail() {}

// Booleans: Question format
const isLoading = true
const hasError = false
const canEdit = userRole === 'admin'

// Constants: SCREAMING_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3
const API_BASE_URL = 'https://api.example.com'
```

### Small Functions
```typescript
// Bad: Function does too much
function processUserAndSendEmail(user: User) {
  // Validate user
  if (!user.email || !user.name) throw new Error('Invalid user')

  // Update database
  db.users.update(user.id, { lastActive: new Date() })

  // Format email
  const subject = `Welcome ${user.name}`
  const body = generateEmailBody(user)

  // Send email
  sendEmail(user.email, subject, body)

  // Log activity
  logger.info(`Processed user ${user.id}`)
}

// Good: Single responsibility
function validateUser(user: User): void {
  if (!user.email || !user.name) {
    throw new ValidationError('User must have email and name')
  }
}

function updateUserActivity(userId: string): void {
  db.users.update(userId, { lastActive: new Date() })
}

function sendWelcomeEmail(user: User): void {
  const email = {
    to: user.email,
    subject: `Welcome ${user.name}`,
    body: generateEmailBody(user)
  }
  sendEmail(email)
}

function processUser(user: User): void {
  validateUser(user)
  updateUserActivity(user.id)
  sendWelcomeEmail(user)
  logger.info(`Processed user ${user.id}`)
}
```

### Function Arguments
```typescript
// Bad: Too many arguments
function createUser(
  name: string,
  email: string,
  age: number,
  address: string,
  phone: string,
  role: string
) {}

// Good: Use object
interface CreateUserParams {
  name: string
  email: string
  age: number
  address: string
  phone: string
  role: string
}

function createUser(params: CreateUserParams) {
  const { name, email, age, address, phone, role } = params
  // ...
}

// Usage
createUser({
  name: 'John',
  email: 'john@example.com',
  age: 30,
  address: '123 Main St',
  phone: '555-1234',
  role: 'user'
})
```

### Don't Repeat Yourself (DRY)
```typescript
// Bad: Repeated logic
function validateEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(email)) throw new Error('Invalid email')
}

function validateUserEmail(user: User) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(user.email)) throw new Error('Invalid email')
}

// Good: Extract common logic
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email)
}

function validateEmail(email: string): void {
  if (!isValidEmail(email)) {
    throw new ValidationError('Invalid email format')
  }
}

function validateUser(user: User): void {
  validateEmail(user.email)
  // Other validations...
}
```

## SOLID Principles

### Single Responsibility
```typescript
// Bad: Class does too much
class User {
  constructor(public name: string, public email: string) {}

  save() {
    // Save to database
  }

  sendEmail(message: string) {
    // Send email
  }

  generateReport() {
    // Generate PDF report
  }
}

// Good: Separate responsibilities
class User {
  constructor(public name: string, public email: string) {}
}

class UserRepository {
  save(user: User) {
    // Save to database
  }

  findById(id: string) {
    // Find user
  }
}

class EmailService {
  sendToUser(user: User, message: string) {
    // Send email
  }
}

class UserReportGenerator {
  generate(user: User) {
    // Generate PDF report
  }
}
```

### Open/Closed Principle
```typescript
// Bad: Modify class to add new functionality
class PaymentProcessor {
  process(amount: number, method: string) {
    if (method === 'credit_card') {
      // Process credit card
    } else if (method === 'paypal') {
      // Process PayPal
    }
    // Adding new method requires modifying this class
  }
}

// Good: Open for extension, closed for modification
interface PaymentMethod {
  process(amount: number): Promise<PaymentResult>
}

class CreditCardPayment implements PaymentMethod {
  async process(amount: number): Promise<PaymentResult> {
    // Process credit card
  }
}

class PayPalPayment implements PaymentMethod {
  async process(amount: number): Promise<PaymentResult> {
    // Process PayPal
  }
}

class PaymentProcessor {
  constructor(private paymentMethod: PaymentMethod) {}

  async process(amount: number): Promise<PaymentResult> {
    return this.paymentMethod.process(amount)
  }
}
```

## Code Smells

### Long Method
- Functions > 20 lines are often doing too much
- Extract into smaller functions
- Each function should do one thing

### Large Class
- Classes > 200 lines often have too many responsibilities
- Split into multiple classes
- Follow Single Responsibility Principle

### Duplicate Code
- Copy-pasted code is a maintenance nightmare
- Extract common logic into functions
- Use inheritance or composition

### Magic Numbers
```typescript
// Bad
if (user.age > 18) {
  // Allow access
}
setTimeout(callback, 3600000)

// Good
const LEGAL_AGE = 18
const ONE_HOUR_MS = 60 * 60 * 1000

if (user.age > LEGAL_AGE) {
  // Allow access
}
setTimeout(callback, ONE_HOUR_MS)
```

### Deep Nesting
```typescript
// Bad: Hard to read
function processOrder(order: Order) {
  if (order) {
    if (order.items) {
      if (order.items.length > 0) {
        if (order.customer) {
          if (order.customer.isActive) {
            // Process order
          }
        }
      }
    }
  }
}

// Good: Guard clauses
function processOrder(order: Order) {
  if (!order) return
  if (!order.items || order.items.length === 0) return
  if (!order.customer || !order.customer.isActive) return

  // Process order
}
```

## Code Review Checklist

### Readability
- ✅ Meaningful variable/function names
- ✅ Consistent naming conventions
- ✅ Appropriate comments (why, not what)
- ✅ Proper indentation and formatting
- ✅ Functions are small and focused

### Maintainability
- ✅ No code duplication (DRY)
- ✅ Separation of concerns
- ✅ Low coupling, high cohesion
- ✅ Easy to change and extend
- ✅ Clear error messages

### Performance
- ✅ No unnecessary computations
- ✅ Efficient algorithms
- ✅ Proper caching where needed
- ✅ Database queries optimized
- ✅ No memory leaks

### Security
- ✅ Input validation
- ✅ No SQL injection vulnerabilities
- ✅ No XSS vulnerabilities
- ✅ Secrets not hardcoded
- ✅ Proper authentication/authorization

### Testing
- ✅ Critical paths are tested
- ✅ Edge cases covered
- ✅ Tests are maintainable
- ✅ Good test coverage
- ✅ Tests actually test behavior

## Linting and Formatting

### ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always']
  }
}
```

### Prettier Configuration
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "avoid"
}
```

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  }
}
```

## Type Safety

### Avoid `any`
```typescript
// Bad
function processData(data: any) {
  return data.map((item: any) => item.value)
}

// Good
interface DataItem {
  value: number
  label: string
}

function processData(data: DataItem[]): number[] {
  return data.map(item => item.value)
}
```

### Use Strict Mode
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

## Error Handling

### Specific Error Types
```typescript
// Good: Custom error types
class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`)
    this.name = 'NotFoundError'
  }
}

// Usage
try {
  const user = await findUser(id)
  if (!user) throw new NotFoundError('User')
  validateUser(user)
} catch (error) {
  if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message })
  }
  if (error instanceof ValidationError) {
    return res.status(400).json({ error: error.message })
  }
  return res.status(500).json({ error: 'Internal server error' })
}
```

## Documentation

### JSDoc Comments
```typescript
/**
 * Calculates the total price including tax
 *
 * @param price - The base price before tax
 * @param taxRate - Tax rate as a decimal (e.g., 0.1 for 10%)
 * @returns The total price including tax
 * @throws {ValidationError} If price is negative
 *
 * @example
 * ```typescript
 * const total = calculateTotal(100, 0.1) // Returns 110
 * ```
 */
function calculateTotal(price: number, taxRate: number): number {
  if (price < 0) throw new ValidationError('Price cannot be negative')
  return price * (1 + taxRate)
}
```

## Refactoring

### When to Refactor
- When adding new features
- When fixing bugs
- During code review
- When code smells are detected

### How to Refactor Safely
1. Write tests first (if not already present)
2. Make small, incremental changes
3. Run tests after each change
4. Commit frequently
5. Review changes before pushing
