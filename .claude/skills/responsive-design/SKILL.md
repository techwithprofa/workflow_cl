---
name: responsive-design
description: Responsive web design principles, mobile-first approach, and adaptive layouts
---

# Responsive Design Skill


Expert knowledge of creating responsive, mobile-first web interfaces.

## Mobile-First Approach

### Start Small, Scale Up
```css
/* Mobile styles (default) */
.container {
  padding: 1rem;
  font-size: 14px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    font-size: 16px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

## Breakpoints

### Standard Breakpoints
```typescript
// Tailwind CSS breakpoints
const breakpoints = {
  sm: '640px',   // Small devices (landscape phones)
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (desktops)
  xl: '1280px',  // Extra large devices (large desktops)
  '2xl': '1536px' // 2X large devices (larger desktops)
}

// Usage in Tailwind
<div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
  Responsive width
</div>
```

### Custom Breakpoints
```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      xs: '475px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  }
}
```

## Responsive Layouts

### Flexbox
```css
/* Mobile: Stack vertically */
.flex-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Desktop: Horizontal layout */
@media (min-width: 768px) {
  .flex-container {
    flex-direction: row;
    justify-content: space-between;
  }

  .flex-item {
    flex: 1;
  }
}
```

### Grid
```css
/* Mobile: Single column */
.grid-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Auto-fit for flexible columns */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

### Container Queries (Modern)
```css
.card-container {
  container-type: inline-size;
}

.card {
  padding: 1rem;
}

/* When container is 400px or wider */
@container (min-width: 400px) {
  .card {
    display: flex;
    gap: 1rem;
  }
}
```

## Responsive Typography

### Fluid Typography
```css
/* Clamp: min, preferred, max */
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.2;
}

p {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  line-height: 1.6;
}

/* Responsive with breakpoints */
.heading {
  font-size: 1.5rem; /* Mobile */
}

@media (min-width: 768px) {
  .heading {
    font-size: 2rem; /* Tablet */
  }
}

@media (min-width: 1024px) {
  .heading {
    font-size: 3rem; /* Desktop */
  }
}
```

### Tailwind Responsive Text
```tsx
<h1 className="text-2xl md:text-4xl lg:text-6xl">
  Responsive Heading
</h1>

<p className="text-sm sm:text-base lg:text-lg">
  Responsive paragraph
</p>
```

## Responsive Images

### Next.js Image Component
```tsx
import Image from 'next/image'

// Responsive image
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  sizes="(max-width: 768px) 100vw,
         (max-width: 1200px) 50vw,
         33vw"
  style={{ width: '100%', height: 'auto' }}
/>
```

### Picture Element
```html
<picture>
  <!-- Mobile -->
  <source
    media="(max-width: 768px)"
    srcset="/image-mobile.jpg"
  />

  <!-- Tablet -->
  <source
    media="(max-width: 1024px)"
    srcset="/image-tablet.jpg"
  />

  <!-- Desktop -->
  <img src="/image-desktop.jpg" alt="Responsive" />
</picture>
```

### CSS Background Images
```css
.hero {
  background-image: url('/hero-mobile.jpg');
  background-size: cover;
  background-position: center;
}

@media (min-width: 768px) {
  .hero {
    background-image: url('/hero-tablet.jpg');
  }
}

@media (min-width: 1024px) {
  .hero {
    background-image: url('/hero-desktop.jpg');
  }
}
```

## Responsive Navigation

### Mobile Menu
```tsx
'use client'
import { useState } from 'react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav>
      {/* Mobile: Hamburger button */}
      <button
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Mobile: Overlay menu */}
      <div
        className={`
          fixed inset-0 bg-white z-50 md:relative md:bg-transparent
          ${isOpen ? 'block' : 'hidden'} md:block
        `}
      >
        <ul className="flex flex-col md:flex-row gap-4 p-4 md:p-0">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  )
}
```

## Responsive Spacing

### Tailwind Responsive Spacing
```tsx
<div className="p-4 md:p-8 lg:p-12">
  {/* padding: 1rem on mobile, 2rem on tablet, 3rem on desktop */}
</div>

<div className="mt-4 md:mt-8 lg:mt-16">
  {/* margin-top scales with screen size */}
</div>

<div className="space-y-4 md:space-y-8">
  {/* gap between children scales */}
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### CSS Custom Properties
```css
:root {
  --spacing-unit: 0.5rem;
}

@media (min-width: 768px) {
  :root {
    --spacing-unit: 1rem;
  }
}

@media (min-width: 1024px) {
  :root {
    --spacing-unit: 1.5rem;
  }
}

.container {
  padding: calc(var(--spacing-unit) * 2);
  gap: var(--spacing-unit);
}
```

## Responsive Tables

### Stacked on Mobile
```tsx
<div className="overflow-x-auto">
  <table className="hidden md:table">
    {/* Normal table for desktop */}
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John Doe</td>
        <td>john@example.com</td>
        <td>Admin</td>
      </tr>
    </tbody>
  </table>

  {/* Card layout for mobile */}
  <div className="md:hidden space-y-4">
    {users.map(user => (
      <div key={user.id} className="border rounded p-4">
        <div><strong>Name:</strong> {user.name}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Role:</strong> {user.role}</div>
      </div>
    ))}
  </div>
</div>
```

## Touch-Friendly Design

### Tap Targets
```css
/* Minimum 44x44px for touch targets */
.button {
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem 1.5rem;
}

/* Adequate spacing between tappable elements */
.nav-items {
  display: flex;
  gap: 1rem; /* At least 8px between items */
}
```

### Hover States
```css
/* Only show hover on devices that support it */
@media (hover: hover) {
  .button:hover {
    background-color: #0056b3;
  }
}

/* Always show active/focus states */
.button:active,
.button:focus-visible {
  background-color: #004494;
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

## Viewport Units

### Useful Units
```css
/* Full viewport height (100vh has issues on mobile) */
.full-screen {
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height */
}

/* Viewport width */
.wide {
  width: 100vw;
}

/* Responsive font size */
h1 {
  font-size: 5vw;
  font-size: clamp(2rem, 5vw, 4rem); /* Better with limits */
}
```

## Testing Responsive Design

### Browser DevTools
- Toggle device toolbar (Cmd/Ctrl + Shift + M)
- Test common devices (iPhone, iPad, Android)
- Test landscape and portrait orientations
- Test different zoom levels

### Physical Devices
- Test on real phones and tablets
- Check touch interactions
- Verify text readability
- Test in different lighting conditions

### Tools
- Chrome DevTools device emulation
- BrowserStack for real device testing
- Responsively App for multi-device preview
- Polypane for side-by-side views

## Best Practices

### General
- ✅ Start with mobile design first
- ✅ Use relative units (rem, %, vw) over px
- ✅ Test on real devices
- ✅ Ensure touch targets are 44x44px minimum
- ✅ Use fluid typography
- ✅ Optimize images for different sizes
- ✅ Consider landscape orientation
- ✅ Test with slow network speeds

### Performance
- ✅ Load smaller images on mobile
- ✅ Lazy load below-the-fold content
- ✅ Reduce JavaScript on mobile
- ✅ Use modern image formats (WebP, AVIF)
- ✅ Enable compression

### Accessibility
- ✅ Maintain proper heading hierarchy
- ✅ Ensure sufficient color contrast
- ✅ Support keyboard navigation
- ✅ Test with screen readers
- ✅ Avoid relying only on hover states

## Common Patterns

### Hide/Show Elements
```tsx
<div className="hidden md:block">
  Desktop only
</div>

<div className="block md:hidden">
  Mobile only
</div>

<div className="md:hidden lg:block">
  Mobile and large desktop
</div>
```

### Responsive Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map(item => (
    <div key={item.id}>{item.name}</div>
  ))}
</div>
```

### Responsive Flexbox
```tsx
<div className="flex flex-col md:flex-row gap-4">
  <div className="flex-1">Sidebar</div>
  <div className="flex-[2]">Main content (2x wider)</div>
</div>
```
