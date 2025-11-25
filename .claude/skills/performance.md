# Performance Skill

Expert knowledge of web performance optimization and Core Web Vitals.

## Core Web Vitals

### Largest Contentful Paint (LCP)
**Target**: < 2.5 seconds

**Optimization**:
```typescript
// Optimize images
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // Preload above-the-fold images
  quality={85}
/>

// Preload critical resources
<link rel="preload" as="image" href="/hero.jpg" />
<link rel="preload" as="font" href="/font.woff2" crossOrigin="anonymous" />

// Use CDN for static assets
// Optimize server response time
// Remove render-blocking resources
```

### First Input Delay (FID) / Interaction to Next Paint (INP)
**Target**: < 100ms (FID), < 200ms (INP)

**Optimization**:
```typescript
// Code splitting
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false // Client-side only if needed
})

// Debounce expensive operations
import { debounce } from 'lodash'

const handleSearch = debounce((query) => {
  performSearch(query)
}, 300)

// Use web workers for heavy computations
const worker = new Worker('/worker.js')
worker.postMessage(data)
```

### Cumulative Layout Shift (CLS)
**Target**: < 0.1

**Optimization**:
```typescript
// Always set dimensions for images and embeds
<Image src="/image.jpg" width={800} height={600} alt="..." />

// Reserve space for dynamic content
<div style={{ minHeight: '200px' }}>
  {loading ? <Skeleton /> : <Content />}
</div>

// Use CSS containment
.card {
  contain: layout;
}

// Avoid inserting content above existing content
// Use transform for animations instead of top/left
.animated {
  transform: translateY(10px);
  transition: transform 0.3s;
}
```

## Bundle Optimization

### Code Splitting
```typescript
// Route-based splitting (Next.js automatic)
// Component-based splitting
const Modal = dynamic(() => import('./Modal'))

// Conditional loading
if (isAdmin) {
  const AdminPanel = (await import('./AdminPanel')).default
}
```

### Tree Shaking
```javascript
// Import only what you need
import { debounce } from 'lodash' // Don't
import debounce from 'lodash/debounce' // Do

// next.config.js
module.exports = {
  webpack: (config) => {
    config.optimization.usedExports = true
    return config
  }
}
```

### Bundle Analysis
```bash
# Install analyzer
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({})

# Run analysis
ANALYZE=true npm run build
```

## Image Optimization

### Next.js Image Component
```typescript
import Image from 'next/image'

// Responsive images
<Image
  src="/photo.jpg"
  alt="Photo"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/..."
/>

// Image loader for CDN
const loader = ({ src, width, quality }) => {
  return `https://cdn.example.com/${src}?w=${width}&q=${quality || 75}`
}

<Image loader={loader} src="photo.jpg" ... />
```

### Manual Optimization
- Use WebP or AVIF format
- Compress images (TinyPNG, ImageOptim)
- Lazy load below-the-fold images
- Use srcset for responsive images
- Implement progressive JPEGs

## React Performance

### Memoization
```typescript
// Memoize expensive calculations
import { useMemo } from 'react'

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])

// Memoize components
import { memo } from 'react'

const MemoizedComponent = memo(function Component({ data }) {
  return <div>{data}</div>
}, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data
})

// Memoize callbacks
import { useCallback } from 'react'

const handleClick = useCallback(() => {
  doSomething(id)
}, [id])
```

### Virtualization
```typescript
// For long lists
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }) {
  const parentRef = useRef()

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50
  })

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Avoid Unnecessary Re-renders
```typescript
// Use keys properly
{items.map(item => (
  <Item key={item.id} item={item} /> // Good
  <Item key={index} item={item} /> // Bad
))}

// Avoid inline object/function creation
// Bad
<Component style={{ margin: 10 }} onClick={() => handle(id)} />

// Good
const style = { margin: 10 }
const handleClick = useCallback(() => handle(id), [id])
<Component style={style} onClick={handleClick} />
```

## Caching Strategies

### HTTP Caching
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  }
}
```

### API Response Caching
```typescript
// Server-side caching
export async function GET(request: Request) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
    }
  })
}
```

### Client-side Caching
```typescript
// SWR
import useSWR from 'swr'

const { data, error } = useSWR('/api/user', fetcher, {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 60000 // 1 minute
})

// React Query
const { data } = useQuery({
  queryKey: ['user', id],
  queryFn: () => fetchUser(id),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000 // 10 minutes
})
```

## Font Optimization

### Next.js Font Optimization
```typescript
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export default function RootLayout({ children }) {
  return (
    <html className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

## Performance Monitoring

### Measuring Performance
```typescript
// Custom metrics
export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    console.log(metric) // { name: 'LCP', value: 1234, ... }
    // Send to analytics
  }
}

// Performance Observer
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.duration)
  }
})
observer.observe({ entryTypes: ['measure', 'navigation'] })
```

### Tools
- Lighthouse (Chrome DevTools)
- WebPageTest
- Chrome User Experience Report
- Vercel Analytics
- Google PageSpeed Insights

## Checklist

- ✅ Optimize images (format, size, lazy loading)
- ✅ Minimize JavaScript bundle size
- ✅ Use code splitting
- ✅ Implement proper caching
- ✅ Optimize fonts
- ✅ Reduce server response time
- ✅ Eliminate render-blocking resources
- ✅ Use CDN for static assets
- ✅ Implement virtualization for long lists
- ✅ Monitor Core Web Vitals
- ✅ Use React.memo, useMemo, useCallback appropriately
- ✅ Optimize database queries
- ✅ Enable compression (gzip/brotli)
