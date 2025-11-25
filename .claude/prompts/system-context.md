# System Context

This file defines the system-level context and behavior for all Claude agents in this project.

## Project Overview

This is a Next.js 14+ application built with:
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Appwrite (BaaS)
- **Deployment**: Vercel
- **Testing**: Jest, React Testing Library, Playwright

## Code Style and Standards

### TypeScript
- Use strict mode
- Avoid `any` - use `unknown` instead
- Prefer interfaces for object shapes
- Use proper type annotations
- No implicit any

### React/Next.js
- Use functional components with hooks
- Server Components by default
- Add 'use client' only when needed
- Use Next.js Image component for images
- Implement proper loading and error states

### Code Quality
- Keep functions small and focused (< 30 lines ideally)
- Follow Single Responsibility Principle
- Use meaningful variable and function names
- Prefer composition over inheritance
- Don't over-engineer - keep it simple

### Formatting
- Use Prettier for consistent formatting
- 2 spaces for indentation
- Single quotes for strings
- Trailing commas in objects and arrays
- Semicolons are optional (follow project convention)

## File Organization

```
project/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Route groups
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── features/         # Feature-specific components
├── lib/                  # Utilities and helpers
├── hooks/                # Custom React hooks
├── services/             # API calls and external services
├── types/                # TypeScript types
├── config/               # Configuration files
└── public/               # Static assets
```

## Naming Conventions

### Files
- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Hooks: `use` + `PascalCase.ts` (e.g., `useAuth.ts`)
- Types: `PascalCase.ts` or `types.ts`

### Variables and Functions
- Variables: `camelCase` (e.g., `userName`, `isLoading`)
- Functions: `camelCase` (e.g., `fetchUser`, `handleClick`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `MAX_RETRIES`)
- Booleans: Use question format (e.g., `isLoading`, `hasError`, `canEdit`)

### Components
- PascalCase (e.g., `Button`, `UserProfile`)
- Descriptive names that reflect purpose
- Prefix with feature name if specific (e.g., `AuthModal`, `ProfileCard`)

## Git Workflow

### Branches
- `main` - Production-ready code
- `develop` - Integration branch (if using Git Flow)
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Commits
- Follow Conventional Commits format
- Use present tense ("add feature" not "added feature")
- Keep first line under 72 characters
- Include body for complex changes
- Reference issues when applicable

### Pull Requests
- Create PRs from feature branches to main
- Include description of changes
- Link related issues
- Request review from team members
- Ensure CI/CD passes
- Keep PRs focused and reasonably sized

## Error Handling

### Client-Side
- Use Error Boundaries for React errors
- Display user-friendly error messages
- Log errors to monitoring service (Sentry)
- Provide recovery options when possible

### Server-Side
- Return appropriate HTTP status codes
- Include error messages in consistent format
- Log errors with context
- Never expose sensitive information in errors

### Format
```typescript
{
  success: false,
  error: {
    message: "User-friendly message",
    code: "ERROR_CODE",
    details: {} // Optional additional details
  }
}
```

## Security Guidelines

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Validate all user inputs
- Sanitize data before displaying
- Use parameterized queries (Appwrite handles this)
- Implement proper authentication and authorization
- Enable CSRF protection
- Set security headers
- Keep dependencies updated

## Performance Considerations

- Use Server Components for non-interactive content
- Implement code splitting with dynamic imports
- Optimize images (use Next.js Image component)
- Lazy load below-the-fold content
- Use proper caching strategies
- Minimize JavaScript bundle size
- Implement virtualization for long lists
- Monitor Core Web Vitals

## Accessibility Standards

- Follow WCAG 2.1 AA guidelines
- Use semantic HTML
- Include proper ARIA attributes
- Ensure keyboard navigation works
- Maintain color contrast ratios (4.5:1)
- Provide alt text for images
- Test with screen readers
- Support reduced motion preferences

## Testing Strategy

### Unit Tests
- Test individual functions and components
- Use Jest and React Testing Library
- Focus on behavior, not implementation
- Aim for >80% coverage on critical paths

### Integration Tests
- Test component interactions
- Test API endpoints
- Use realistic test data
- Mock external services

### E2E Tests
- Test critical user flows
- Use Playwright
- Focus on happy paths and edge cases
- Run in CI/CD pipeline

## Documentation

- Keep README up-to-date
- Document complex logic with comments
- Use JSDoc for public APIs
- Include examples in documentation
- Update docs when code changes
- Write for future developers

## Communication Style

When providing responses:
- Be clear and concise
- Explain complex concepts simply
- Provide code examples
- Link to relevant documentation
- Acknowledge uncertainties
- Ask for clarification when needed

## Agent Coordination

- Main Agent orchestrates complex tasks
- Specialized agents handle specific domains
- Share context through this system prompt
- Follow consistent patterns across agents
- Use TodoWrite for task tracking
