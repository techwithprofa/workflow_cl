---
name: architecture
description: Software architecture patterns, design principles, and system design fundamentals
---

# Architecture Skill


Expert knowledge of software architecture and system design.

## Architectural Patterns

### Layered Architecture
- **Presentation Layer**: UI components and pages
- **Business Logic Layer**: Application logic and workflows
- **Data Access Layer**: Database queries and API calls
- **Infrastructure Layer**: External services and utilities

### Component Architecture
```
src/
├── app/              # Next.js pages and routes
├── components/       # Reusable UI components
│   ├── ui/          # Base components (Button, Input)
│   └── features/    # Feature-specific components
├── lib/             # Utilities and helpers
├── hooks/           # Custom React hooks
├── services/        # API calls and external services
├── stores/          # State management
├── types/           # TypeScript types
└── config/          # Configuration files
```

## Design Principles

### SOLID Principles
- **Single Responsibility**: One reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable
- **Interface Segregation**: Many specific interfaces over one general
- **Dependency Inversion**: Depend on abstractions, not concretions

### Composition Over Inheritance
- Use composition to build complex behaviors
- Prefer functional composition in React
- Use hooks for reusable logic
- Component composition with children and render props

## Patterns for React Applications

### Component Patterns
```typescript
// Compound Components
<Select>
  <Select.Trigger />
  <Select.Options>
    <Select.Option value="1" />
  </Select.Options>
</Select>

// Render Props
<DataProvider render={(data) => <View data={data} />} />

// Higher-Order Components (use sparingly)
const withAuth = (Component) => (props) => {
  // Auth logic
  return <Component {...props} />
}
```

### State Management
- Local state: useState for component-specific state
- Shared state: Context API for medium complexity
- Complex state: Zustand or Redux for global state
- Server state: React Query or SWR for API data

### Data Flow
- One-way data flow (props down, events up)
- Lift state up to common ancestor
- Use context for deeply nested props
- Keep state as local as possible

## Scalability Considerations

### Code Organization
- Feature-based folders over type-based
- Colocate related files
- Keep components small and focused
- Extract reusable logic into hooks

### Performance
- Code splitting with dynamic imports
- Lazy loading for routes and components
- Virtualization for long lists
- Memoization for expensive calculations

### Maintainability
- Write self-documenting code
- Use TypeScript for type safety
- Consistent naming conventions
- Regular refactoring to reduce technical debt

## API Design

### RESTful API Structure
```
GET    /api/users       # List users
GET    /api/users/:id   # Get user
POST   /api/users       # Create user
PUT    /api/users/:id   # Update user
DELETE /api/users/:id   # Delete user
```

### Error Handling Strategy
- Consistent error response format
- Proper HTTP status codes
- User-friendly error messages
- Error boundaries in React
- Centralized error logging

## Security Architecture
- Authentication vs Authorization
- Token-based auth (JWT)
- Secure session management
- Input validation and sanitization
- Protection against OWASP Top 10
