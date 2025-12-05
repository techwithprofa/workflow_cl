---
name: documentation
description: Technical writing practices, documentation standards, and knowledge management
---

# Documentation Skill


Expert knowledge of writing effective technical documentation.

## Documentation Types

### API Documentation
```typescript
/**
 * Fetches user data from the API
 *
 * @param userId - The unique identifier for the user
 * @param options - Optional configuration
 * @param options.includeProfile - Whether to include profile data
 * @returns Promise resolving to user data
 * @throws {NotFoundError} When user doesn't exist
 * @throws {NetworkError} When network request fails
 *
 * @example
 * ```typescript
 * const user = await fetchUser('123', { includeProfile: true })
 * console.log(user.name)
 * ```
 */
export async function fetchUser(
  userId: string,
  options?: { includeProfile?: boolean }
): Promise<User> {
  // Implementation
}
```

### README Files
```markdown
# Project Name

Brief description of what the project does.

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

\`\`\`bash
npm install
cp .env.example .env
npm run dev
\`\`\`

## Usage

\`\`\`typescript
import { foo } from 'package'

foo.doSomething()
\`\`\`

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| apiUrl | string | - | API endpoint URL |
| timeout | number | 5000 | Request timeout in ms |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT
```

### Code Comments
```typescript
// Good comments explain WHY, not WHAT

// Bad: Increments counter
count++

// Good: Track failed attempts for rate limiting
failedAttempts++

// Document complex algorithms
/**
 * Uses binary search to find insertion point.
 * Time complexity: O(log n)
 * This approach is faster than linear search for large datasets.
 */
function findInsertionPoint(array: number[], value: number): number {
  // Implementation
}

// Document workarounds
// HACK: IE11 doesn't support Array.from()
const arr = Array.prototype.slice.call(arrayLike)

// Document TODOs
// TODO: Refactor to use async/await (currently callbacks)
// TODO(john): Add validation for edge case where x < 0
```

## Writing Style

### Clarity
```markdown
<!-- Bad: Vague and confusing -->
The system does stuff with the data.

<!-- Good: Clear and specific -->
The API validates the request, processes the data, and returns a JSON response.
```

### Active Voice
```markdown
<!-- Bad: Passive voice -->
The data is processed by the server.

<!-- Good: Active voice -->
The server processes the data.
```

### Conciseness
```markdown
<!-- Bad: Wordy -->
In order to be able to use this feature, you will need to make sure that you have properly configured the environment variables in your .env file.

<!-- Good: Concise -->
Configure environment variables in your .env file to use this feature.
```

## Documentation Structure

### Tutorial (Learning-Oriented)
- Step-by-step guidance
- Example project
- Hand-holding approach
- Minimal theory

```markdown
# Getting Started with Project

## Step 1: Install Dependencies

First, install the required packages:

\`\`\`bash
npm install
\`\`\`

## Step 2: Configure Environment

Create a `.env` file with your API key:

\`\`\`
API_KEY=your_key_here
\`\`\`

## Step 3: Run the Application

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

You should see the app running at http://localhost:3000
```

### How-To Guide (Task-Oriented)
- Solve specific problems
- Assumes some knowledge
- Multiple approaches ok
- Real-world scenarios

```markdown
# How to Add Authentication

This guide shows how to add authentication to your app.

## Prerequisites

- Existing Next.js application
- Basic understanding of React hooks

## Steps

### 1. Install Auth Library

\`\`\`bash
npm install next-auth
\`\`\`

### 2. Create Auth Configuration

\`\`\`typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ]
}

export const GET = NextAuth(authOptions)
export const POST = GET
\`\`\`

### 3. Add Session Provider

\`\`\`typescript
// app/layout.tsx
import { SessionProvider } from 'next-auth/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
\`\`\`

## Testing

Test the auth flow by visiting `/api/auth/signin`

## Troubleshooting

**Issue**: "Client ID not found"
**Solution**: Verify GOOGLE_CLIENT_ID is set in .env

**Issue**: Redirect not working
**Solution**: Check NEXTAUTH_URL matches your domain
```

### Reference (Information-Oriented)
- Technical descriptions
- Accuracy is critical
- Comprehensive coverage
- Austere tone

```markdown
# API Reference

## fetchUser

Retrieves user data from the database.

### Syntax

\`\`\`typescript
fetchUser(userId: string, options?: FetchOptions): Promise<User>
\`\`\`

### Parameters

- `userId` (string, required): User's unique identifier
- `options` (FetchOptions, optional): Configuration options
  - `includeProfile` (boolean): Include profile data. Default: false
  - `cache` (boolean): Use cached data if available. Default: true

### Return Value

Returns a Promise that resolves to a User object.

### Exceptions

- `NotFoundError`: User not found in database
- `ValidationError`: Invalid userId format
- `NetworkError`: Database connection failed

### Example

\`\`\`typescript
try {
  const user = await fetchUser('user_123', { includeProfile: true })
  console.log(user.name)
} catch (error) {
  if (error instanceof NotFoundError) {
    console.error('User not found')
  }
}
\`\`\`

### See Also

- [User object schema](#user-schema)
- [Error handling guide](#error-handling)
```

### Explanation (Understanding-Oriented)
- Clarify and illuminate
- Provide context
- Alternative opinions
- Consider different angles

```markdown
# Understanding Server Components

Server Components are a new paradigm in React that changes how we think about rendering.

## Traditional Approach

Historically, React components run in the browser. The server sends HTML, and React "hydrates" it by attaching event handlers and making it interactive.

## Server Components

Server Components run only on the server. They:
- Never send JavaScript to the client
- Can directly access backend resources (databases, file system)
- Improve performance by reducing bundle size

## When to Use

Use Server Components for:
- Data fetching
- Accessing backend resources
- Large dependencies that don't need client-side
- SEO-important content

Use Client Components for:
- Interactivity (onClick, onChange)
- Browser APIs (localStorage, geolocation)
- React hooks (useState, useEffect)
- Event handlers

## Mental Model

Think of Server Components as "templates" that run once on the server, while Client Components are "interactive widgets" that run in the browser.

\`\`\`
Server Component (runs on server)
├── Client Component (runs on browser)
│   └── Server Component (children ok!)
└── Server Component (runs on server)
\`\`\`

## Trade-offs

**Benefits**:
- Smaller bundle size
- Better performance
- Direct backend access
- Improved security (API keys stay on server)

**Limitations**:
- No interactivity
- No browser APIs
- No React hooks
- Can't use Context (except through Client Components)
```

## Diagrams and Visuals

### Architecture Diagrams
```markdown
## System Architecture

\`\`\`
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Browser   │─────▶│   Next.js   │─────▶│  Database   │
│             │◀─────│   Server    │◀─────│             │
└─────────────┘      └─────────────┘      └─────────────┘
```

### Mermaid Diagrams
```markdown
\`\`\`mermaid
sequenceDiagram
    participant User
    participant App
    participant API
    participant DB

    User->>App: Click login
    App->>API: POST /auth/login
    API->>DB: Query user
    DB-->>API: User data
    API-->>App: JWT token
    App-->>User: Redirect to dashboard
\`\`\`
```

## Documentation Checklist

- ✅ Clear and concise writing
- ✅ Code examples that actually work
- ✅ Prerequisites listed
- ✅ Error cases documented
- ✅ Keep up-to-date with code
- ✅ Include visuals where helpful
- ✅ Link to related documentation
- ✅ Provide context and reasoning
- ✅ Consider different skill levels
- ✅ Use consistent terminology
- ✅ Test all code examples
- ✅ Include troubleshooting section

## Common Pitfalls

### Outdated Documentation
- Set up automated checks
- Review docs during code reviews
- Mark deprecated features clearly

### Assumption of Knowledge
- Define technical terms
- Link to prerequisite reading
- Include beginner-friendly examples

### Missing Context
- Explain why, not just how
- Include use cases
- Show alternative approaches

### Poor Examples
- Test all code examples
- Use realistic scenarios
- Show edge cases
