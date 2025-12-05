---
name: nextjs
description: Expert knowledge of Next.js framework for building modern React applications with App Router, server components, and optimized performance
---

# Next.js Skill


Expert knowledge of Next.js framework for building React applications.

## Core Concepts

### App Router (Next.js 13+)
- Server Components by default
- Client Components with 'use client' directive
- File-based routing with app/ directory
- Layouts, templates, and nested routes
- Loading and error UI states
- Route groups and parallel routes

### Data Fetching
- Server Components: Direct async/await in components
- Client Components: Use SWR or React Query
- Streaming with Suspense boundaries
- Server Actions for mutations
- Revalidation strategies (time-based, on-demand)

### Rendering Strategies
- **Static Generation (SSG)**: Pre-render at build time
- **Incremental Static Regeneration (ISR)**: Update static pages after build
- **Server-Side Rendering (SSR)**: Render on each request
- **Client-Side Rendering (CSR)**: Render in browser

## Best Practices

### File Structure
```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Home page
├── api/
│   └── route.ts        # API routes
├── (auth)/
│   ├── login/
│   └── register/
└── dashboard/
    ├── layout.tsx
    └── page.tsx
```

### Performance
- Use Server Components by default
- Add 'use client' only when needed (interactivity, hooks)
- Optimize images with next/image
- Use dynamic imports for code splitting
- Implement proper caching strategies

### Metadata & SEO
- Use generateMetadata for dynamic meta tags
- Add proper Open Graph and Twitter card metadata
- Include structured data (JSON-LD)
- Use semantic HTML

## Common Patterns

### Loading States
```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <Skeleton />
}
```

### Error Handling
```tsx
// app/dashboard/error.tsx
'use client'
export default function Error({ error, reset }) {
  return <ErrorComponent error={error} onReset={reset} />
}
```

### Server Actions
```tsx
// app/actions.ts
'use server'
export async function createPost(formData: FormData) {
  // Server-side logic
}
```

## Optimization Tips
- Enable React Strict Mode
- Use next/font for font optimization
- Implement proper image optimization
- Use middleware for auth and redirects
- Enable TypeScript strict mode
