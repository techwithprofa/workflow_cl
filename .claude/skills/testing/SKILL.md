---
name: testing
description: Unit testing, integration testing, and testing methodologies for robust code
---

# Testing Skill


Expert knowledge of testing strategies and frameworks for web applications.

## Testing Pyramid

### Unit Tests (70%)
- Test individual functions and components
- Fast, isolated, deterministic
- Mock external dependencies
- Focus on business logic

### Integration Tests (20%)
- Test multiple units working together
- Test API endpoints
- Test database interactions
- Test component integration

### E2E Tests (10%)
- Test complete user workflows
- Test through the browser
- Minimal mocking
- Focus on critical paths

## Testing Frameworks

### Jest / Vitest
```typescript
describe('calculateTotal', () => {
  it('should sum array of numbers', () => {
    expect(calculateTotal([1, 2, 3])).toBe(6)
  })

  it('should return 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0)
  })

  it('should handle negative numbers', () => {
    expect(calculateTotal([-1, 1])).toBe(0)
  })
})
```

### React Testing Library
```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('submits form with user data', async () => {
  const onSubmit = jest.fn()
  render(<UserForm onSubmit={onSubmit} />)

  await userEvent.type(screen.getByLabelText('Name'), 'John Doe')
  await userEvent.type(screen.getByLabelText('Email'), 'john@example.com')
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com'
    })
  })
})
```

## Best Practices

### Test Structure (AAA Pattern)
```typescript
test('description', () => {
  // Arrange - Setup test data and conditions
  const user = { name: 'John', age: 30 }

  // Act - Execute the code being tested
  const result = formatUser(user)

  // Assert - Verify the result
  expect(result).toBe('John (30)')
})
```

### Test Naming
- Describe what is being tested
- State the expected behavior
- Include relevant conditions

```typescript
// Good
test('displays error message when login fails')
test('disables submit button while form is submitting')
test('filters items by category when category is selected')

// Bad
test('test 1')
test('form works')
test('should work correctly')
```

### What to Test

#### Do Test
- Public API of components/functions
- User interactions
- Edge cases and error conditions
- Data transformations
- Business logic

#### Don't Test
- Implementation details
- Third-party libraries
- Framework internals
- Trivial code (getters/setters)

## Mocking

### Mock Functions
```typescript
const mockFn = jest.fn()
mockFn.mockReturnValue(42)
mockFn.mockResolvedValue({ data: 'success' })
mockFn.mockRejectedValue(new Error('Failed'))

expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith('arg')
expect(mockFn).toHaveBeenCalledTimes(2)
```

### Mock Modules
```typescript
jest.mock('./api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ name: 'John' })
}))
```

### Mock Timers
```typescript
jest.useFakeTimers()
setTimeout(() => callback(), 1000)
jest.advanceTimersByTime(1000)
expect(callback).toHaveBeenCalled()
```

## Testing Async Code

### Promises
```typescript
test('fetches user data', async () => {
  const data = await fetchUser(1)
  expect(data.name).toBe('John')
})
```

### Waiting for Elements
```typescript
const element = await screen.findByText('Loaded')
await waitFor(() => expect(screen.getByText('Done')).toBeInTheDocument())
```

## Common Patterns

### Testing Hooks
```typescript
import { renderHook, act } from '@testing-library/react'

test('useCounter increments', () => {
  const { result } = renderHook(() => useCounter())

  act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(1)
})
```

### Testing Context
```typescript
const wrapper = ({ children }) => (
  <ThemeContext.Provider value="dark">
    {children}
  </ThemeContext.Provider>
)

render(<Component />, { wrapper })
```

### Testing Error Boundaries
```typescript
test('shows error UI when component throws', () => {
  const error = new Error('Test error')
  jest.spyOn(console, 'error').mockImplementation(() => {})

  render(
    <ErrorBoundary>
      <ThrowError error={error} />
    </ErrorBoundary>
  )

  expect(screen.getByText('Something went wrong')).toBeInTheDocument()
})
```

## Coverage

### Measuring Coverage
```bash
npm test -- --coverage
```

### Coverage Goals
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

### Coverage ≠ Quality
- High coverage doesn't mean good tests
- Focus on testing behavior, not coverage percentage
- Prioritize critical paths over 100% coverage

## Test Maintenance

### Keep Tests DRY
- Extract common setup into utilities
- Use test factories for test data
- Share setup with beforeEach/beforeAll

### Keep Tests Focused
- One assertion per test (generally)
- Test one thing at a time
- Avoid test interdependencies

### Keep Tests Fast
- Mock expensive operations
- Use in-memory databases
- Parallelize test execution
- Skip tests that aren't needed

## Debugging Failed Tests

### Techniques
- Use `screen.debug()` to see component output
- Add `.only` to run single test
- Use `--watch` mode for iterative development
- Check test file for proper cleanup
- Review mock implementations
