---
name: typescript
description: TypeScript language features, type systems, and advanced type patterns
---

# TypeScript Skill


Expert knowledge of TypeScript for type-safe JavaScript development.

## Core Concepts

### Type System
- Primitive types: string, number, boolean, null, undefined
- Object types and interfaces
- Union and intersection types
- Literal types and type narrowing
- Generic types for reusability
- Utility types: Partial, Required, Pick, Omit, Record

### Advanced Types
```typescript
// Conditional types
type IsString<T> = T extends string ? true : false

// Mapped types
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

// Template literal types
type EventName = `on${Capitalize<string>}`

// Type inference
const user = { name: 'John', age: 30 } // Inferred type
```

## Best Practices

### Strict Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Type Safety
- Avoid `any` - use `unknown` instead
- Use type guards for narrowing
- Prefer interfaces for object shapes
- Use const assertions for literal types
- Discriminated unions for variants

### React + TypeScript
```typescript
// Props with children
interface Props {
  title: string
  children: React.ReactNode
}

// Event handlers
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {}

// Refs
const inputRef = useRef<HTMLInputElement>(null)

// Generic components
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}
```

## Common Patterns

### Type Guards
```typescript
function isError(value: unknown): value is Error {
  return value instanceof Error
}
```

### Discriminated Unions
```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string }
```

### Utility Type Helpers
```typescript
// Extract function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

// Make specific properties optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
```

## Anti-Patterns to Avoid
- Using `any` instead of proper types
- Type assertions without validation
- Ignoring TypeScript errors with @ts-ignore
- Over-complicated generic types
- Not using strict mode
