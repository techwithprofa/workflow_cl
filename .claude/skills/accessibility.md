# Accessibility Skill

Expert knowledge of web accessibility (a11y) and WCAG guidelines.

## WCAG Principles (POUR)

### Perceivable
Users must be able to perceive the information being presented

### Operable
Users must be able to operate the interface

### Understandable
Users must be able to understand the information and operation

### Robust
Content must be robust enough to work with various technologies

## Semantic HTML

### Use Proper Elements
```html
<!-- Bad: Divs for everything -->
<div class="header">
  <div class="nav">
    <div onclick="navigate()">Home</div>
  </div>
</div>

<!-- Good: Semantic elements -->
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
```

### Heading Hierarchy
```html
<!-- Bad: Skipping levels -->
<h1>Page Title</h1>
<h3>Section</h3>
<h5>Subsection</h5>

<!-- Good: Proper hierarchy -->
<h1>Page Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>
```

### Landmarks
```html
<header><!-- Site header --></header>
<nav><!-- Navigation --></nav>
<main><!-- Main content --></main>
<aside><!-- Sidebar --></aside>
<footer><!-- Site footer --></footer>
```

## ARIA (Accessible Rich Internet Applications)

### ARIA Roles
```tsx
<div role="button" tabIndex={0} onClick={handleClick}>
  Clickable Div (but use <button> instead!)
</div>

<nav role="navigation" aria-label="Main">
  {/* Navigation links */}
</nav>

<div role="alert" aria-live="polite">
  Form submitted successfully
</div>
```

### ARIA Labels
```tsx
// Button with no visible text
<button aria-label="Close dialog">
  <X />
</button>

// Input with label
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Or with aria-label
<input
  type="email"
  aria-label="Email address"
  placeholder="you@example.com"
/>

// Group of inputs
<fieldset>
  <legend>Personal Information</legend>
  <input type="text" aria-label="First name" />
  <input type="text" aria-label="Last name" />
</fieldset>
```

### ARIA States
```tsx
// Expanded/Collapsed
<button
  aria-expanded={isOpen}
  aria-controls="menu"
  onClick={() => setIsOpen(!isOpen)}
>
  Menu
</button>
<div id="menu" hidden={!isOpen}>
  {/* Menu content */}
</div>

// Selected state
<button
  role="tab"
  aria-selected={isSelected}
  tabIndex={isSelected ? 0 : -1}
>
  Tab 1
</button>

// Checked state
<button
  role="checkbox"
  aria-checked={isChecked}
  onClick={() => setIsChecked(!isChecked)}
>
  Accept terms
</button>
```

### ARIA Live Regions
```tsx
// Polite: Announced after current speech
<div role="status" aria-live="polite">
  3 items remaining
</div>

// Assertive: Interrupts current speech
<div role="alert" aria-live="assertive">
  Error: Form submission failed
</div>

// Off: Not announced
<div aria-live="off">
  Updating frequently...
</div>
```

## Keyboard Navigation

### Focus Management
```tsx
// Focusable elements
<button>Naturally focusable</button>
<a href="/link">Naturally focusable</a>
<input type="text" />

// Make div focusable (but don't!)
<div tabIndex={0}>Focusable div</div>

// Remove from tab order
<button tabIndex={-1}>Not in tab order</button>

// Custom focus order (avoid if possible)
<input tabIndex={2} />
<input tabIndex={1} />
```

### Keyboard Event Handlers
```tsx
function AccessibleButton({ onClick, children }) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter or Space activates button
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <button onClick={onClick} onKeyDown={handleKeyDown}>
      {children}
    </button>
  )
}
```

### Focus Visible
```css
/* Show focus indicator */
button:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Don't remove focus outline! */
/* Bad */
button:focus {
  outline: none;
}

/* Good: Style it properly */
button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

### Skip Links
```tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white"
    >
      Skip to main content
    </a>
  )
}

// In layout
<SkipLink />
<nav>...</nav>
<main id="main-content">...</main>
```

## Color and Contrast

### Contrast Ratios
```typescript
// WCAG AA (minimum)
// Normal text: 4.5:1
// Large text (18pt+): 3:1

// WCAG AAA (enhanced)
// Normal text: 7:1
// Large text: 4.5:1

// Good examples
const textOnWhite = '#333333' // 11.8:1
const linkBlue = '#0066cc'    // 4.5:1 on white

// Bad examples
const lightGray = '#cccccc'   // 1.6:1 on white ❌
const paleBlue = '#9999ff'    // 2.4:1 on white ❌
```

### Don't Rely Only on Color
```tsx
// Bad: Color only
<span style={{ color: 'red' }}>Error</span>

// Good: Color + icon + text
<span className="text-red-600">
  <AlertIcon /> Error: Invalid email
</span>

// Good: Multiple indicators
<input
  aria-invalid={hasError}
  aria-describedby={hasError ? 'error-msg' : undefined}
  className={hasError ? 'border-red-500' : 'border-gray-300'}
/>
{hasError && (
  <p id="error-msg" className="text-red-600" role="alert">
    <AlertIcon /> Please enter a valid email
  </p>
)}
```

## Images and Media

### Alt Text
```tsx
// Informative image
<Image
  src="/chart.png"
  alt="Sales increased 25% from Q1 to Q2"
  width={600}
  height={400}
/>

// Decorative image
<Image
  src="/decoration.png"
  alt="" // Empty alt for decorative images
  width={100}
  height={100}
  aria-hidden="true"
/>

// Complex image
<figure>
  <Image
    src="/complex-chart.png"
    alt="Annual revenue breakdown by category"
    width={800}
    height={600}
  />
  <figcaption>
    Detailed description: Revenue increased in all categories
    except electronics which decreased 5%...
  </figcaption>
</figure>
```

### Video Captions
```html
<video controls>
  <source src="video.mp4" type="video/mp4" />
  <track
    kind="captions"
    src="captions-en.vtt"
    srclang="en"
    label="English"
    default
  />
  <track
    kind="captions"
    src="captions-es.vtt"
    srclang="es"
    label="Español"
  />
</video>
```

## Forms

### Labels and Instructions
```tsx
// Always label inputs
<label htmlFor="email">
  Email address *
</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
  aria-describedby="email-help"
/>
<p id="email-help" className="text-sm text-gray-500">
  We'll never share your email
</p>

// Group related inputs
<fieldset>
  <legend>Shipping address</legend>
  <label htmlFor="street">Street</label>
  <input id="street" type="text" />

  <label htmlFor="city">City</label>
  <input id="city" type="text" />
</fieldset>
```

### Error Messages
```tsx
function FormField({ error, ...props }) {
  const errorId = `${props.id}-error`

  return (
    <div>
      <label htmlFor={props.id}>{props.label}</label>
      <input
        {...props}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} role="alert" className="text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
```

## Modal Dialogs

### Accessible Modal
```tsx
'use client'
import { useEffect, useRef } from 'react'

export function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Store previous focus
      previousFocus.current = document.activeElement as HTMLElement

      // Focus first focusable element in modal
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      firstFocusable?.focus()

      // Trap focus in modal
      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          if (!focusableElements) return

          const firstElement = focusableElements[0] as HTMLElement
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }

        // Close on Escape
        if (e.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleTab)
      return () => document.removeEventListener('keydown', handleTab)
    } else {
      // Restore focus when closed
      previousFocus.current?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div className="relative bg-white rounded-lg p-6 max-w-md">
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-2 right-2"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}
```

## Screen Reader Only Content

### SR-Only Class
```css
/* Tailwind CSS sr-only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Usage
```tsx
<button>
  <TrashIcon />
  <span className="sr-only">Delete item</span>
</button>

<a href="/cart">
  <CartIcon />
  {itemCount > 0 && (
    <>
      <span className="badge">{itemCount}</span>
      <span className="sr-only">{itemCount} items in cart</span>
    </>
  )}
</a>
```

## Testing Accessibility

### Tools
- **Lighthouse**: Automated accessibility audit
- **axe DevTools**: Browser extension for a11y testing
- **WAVE**: Web accessibility evaluation tool
- **NVDA/JAWS**: Screen reader testing (Windows)
- **VoiceOver**: Screen reader testing (Mac/iOS)
- **Keyboard**: Test with keyboard only (no mouse)

### Automated Testing
```typescript
// Jest with jest-axe
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('should not have accessibility violations', async () => {
  const { container } = render(<MyComponent />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility Checklist

- ✅ All images have alt text
- ✅ All form inputs have labels
- ✅ Color contrast meets WCAG AA (4.5:1)
- ✅ All interactive elements are keyboard accessible
- ✅ Focus indicators are visible
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ Links have descriptive text (not "click here")
- ✅ Tables have headers
- ✅ ARIA attributes used correctly
- ✅ No flashing content (seizure risk)
- ✅ Text can be resized to 200%
- ✅ Page is usable with keyboard only
- ✅ Screen reader friendly
- ✅ Error messages are clear and associated with fields
- ✅ Skip links provided
