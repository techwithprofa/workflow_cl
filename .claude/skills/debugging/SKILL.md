---
name: debugging
description: Debugging techniques, tools, and strategies for identifying and fixing issues
---

# Debugging Skill


Expert knowledge of debugging techniques and tools for web applications.

## Debugging Tools

### Browser DevTools

#### Console
```javascript
// Basic logging
console.log('Value:', value)
console.warn('Warning message')
console.error('Error message')

// Formatted logging
console.table([{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }])
console.group('Group name')
console.log('Item 1')
console.log('Item 2')
console.groupEnd()

// Performance measurement
console.time('operation')
performExpensiveOperation()
console.timeEnd('operation') // operation: 123.45ms

// Stack trace
console.trace('Trace point')
```

#### Debugger
```javascript
// Set breakpoint programmatically
function problematicFunction() {
  debugger // Execution will pause here
  const result = calculate()
  return result
}

// Conditional breakpoints (in DevTools)
// Right-click breakpoint → Edit breakpoint
// Condition: x > 10
```

#### Network Tab
- Monitor API requests/responses
- Check request headers and payloads
- Identify slow requests
- Debug CORS issues
- Throttle network speed for testing

#### React DevTools
```javascript
// Install React DevTools extension
// Inspect component props and state
// Profile component re-renders
// Trace why component updated
```

## Debugging Strategies

### Reproduce the Bug
1. Find steps to consistently reproduce
2. Minimize test case
3. Isolate the problem
4. Document reproduction steps

### Binary Search Debugging
```javascript
// Comment out half the code
// Does bug still occur?
// If yes: bug is in remaining code
// If no: bug is in commented code
// Repeat until found
```

### Console Logging
```typescript
// Strategic logging
function processData(data: Data[]) {
  console.log('Input:', data) // 1. Check input

  const filtered = data.filter(item => {
    const result = item.value > 10
    console.log('Filter:', item, result) // 2. Check filter logic
    return result
  })
  console.log('Filtered:', filtered) // 3. Check filter output

  const mapped = filtered.map(item => ({
    ...item,
    doubled: item.value * 2
  }))
  console.log('Mapped:', mapped) // 4. Check map output

  return mapped
}
```

### Error Boundaries
```typescript
import { Component, ReactNode } from 'react'

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo.componentStack)
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong</h2>
          <pre>{this.state.error?.message}</pre>
        </div>
      )
    }
    return this.props.children
  }
}
```

## Common Issues

### React Rendering Issues

#### Infinite Loop
```typescript
// Problem
useEffect(() => {
  setCount(count + 1) // Causes infinite loop
}, [count])

// Solution 1: Remove dependency
useEffect(() => {
  setCount(c => c + 1) // Use functional update
}, [])

// Solution 2: Add condition
useEffect(() => {
  if (count < 10) {
    setCount(count + 1)
  }
}, [count])
```

#### Stale Closures
```typescript
// Problem
function Component() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(count) // Always logs 0 (stale)
      setCount(count + 1) // Doesn't work correctly
    }, 1000)
    return () => clearInterval(interval)
  }, []) // Empty deps = stale closure

  return <div>{count}</div>
}

// Solution
useEffect(() => {
  const interval = setInterval(() => {
    setCount(c => c + 1) // Use functional update
  }, 1000)
  return () => clearInterval(interval)
}, []) // No dependencies needed
```

#### Missing Keys
```typescript
// Problem
{items.map((item, index) => (
  <Item key={index} item={item} /> // Causes re-render issues
))}

// Solution
{items.map(item => (
  <Item key={item.id} item={item} /> // Use stable unique ID
))}
```

### Async Issues

#### Race Conditions
```typescript
// Problem
useEffect(() => {
  fetchUser(userId).then(user => {
    setUser(user) // Might set wrong user if userId changed
  })
}, [userId])

// Solution: Cleanup flag
useEffect(() => {
  let cancelled = false

  fetchUser(userId).then(user => {
    if (!cancelled) {
      setUser(user)
    }
  })

  return () => {
    cancelled = true
  }
}, [userId])

// Better: Use AbortController
useEffect(() => {
  const controller = new AbortController()

  fetch(`/api/users/${userId}`, { signal: controller.signal })
    .then(res => res.json())
    .then(user => setUser(user))
    .catch(err => {
      if (err.name !== 'AbortError') {
        console.error(err)
      }
    })

  return () => controller.abort()
}, [userId])
```

### Memory Leaks

#### Event Listeners
```typescript
// Problem
useEffect(() => {
  window.addEventListener('resize', handleResize)
  // Missing cleanup!
}, [])

// Solution
useEffect(() => {
  window.addEventListener('resize', handleResize)
  return () => {
    window.removeEventListener('resize', handleResize)
  }
}, [])
```

#### Subscriptions
```typescript
// Problem
useEffect(() => {
  const subscription = observable.subscribe(data => {
    setData(data)
  })
  // Missing cleanup!
}, [])

// Solution
useEffect(() => {
  const subscription = observable.subscribe(data => {
    setData(data)
  })
  return () => subscription.unsubscribe()
}, [])
```

## Advanced Debugging

### Source Maps
```javascript
// next.config.js
module.exports = {
  productionBrowserSourceMaps: true, // Enable in production
}
```

### Performance Profiling
```typescript
// React Profiler
import { Profiler } from 'react'

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`)
}

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

### Remote Debugging
```bash
# Node.js debugging
node --inspect-brk=0.0.0.0:9229 server.js

# Connect Chrome DevTools
# Open chrome://inspect
```

## Error Handling

### Try-Catch Blocks
```typescript
async function fetchData() {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Fetch failed:', error)
    if (error instanceof TypeError) {
      // Network error
      throw new Error('Network error. Please check your connection.')
    }
    throw error
  }
}
```

### Global Error Handling
```typescript
// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason)
  // Log to error service
})

// Catch uncaught errors
window.addEventListener('error', event => {
  console.error('Uncaught error:', event.error)
  // Log to error service
})
```

## Debugging Checklist

- ✅ Check console for errors/warnings
- ✅ Verify API requests in Network tab
- ✅ Inspect component state/props (React DevTools)
- ✅ Check for console.log statements
- ✅ Verify data types (typeof, instanceof)
- ✅ Check for null/undefined values
- ✅ Verify async operations complete
- ✅ Check event listeners are attached/cleaned up
- ✅ Verify dependencies in useEffect
- ✅ Check for infinite loops
- ✅ Profile performance if slow
- ✅ Check browser compatibility

## Tools

- **Chrome DevTools**: Comprehensive debugging
- **React DevTools**: React-specific debugging
- **Redux DevTools**: State debugging
- **Sentry**: Error tracking and monitoring
- **LogRocket**: Session replay
- **Lighthouse**: Performance auditing
- **Why Did You Render**: React re-render debugging
