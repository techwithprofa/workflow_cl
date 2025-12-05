---
name: shadow-system
description: Shadow DOM, Web Components, and encapsulated styling systems
---

# Design System Skill


Expert knowledge of creating and maintaining consistent design systems.

## What is a Design System?

A design system is a collection of reusable components, guided by clear standards, that can be assembled to build applications.

### Components
- **UI Components**: Buttons, inputs, cards, modals
- **Design Tokens**: Colors, typography, spacing, shadows
- **Patterns**: Navigation, forms, data display
- **Guidelines**: Accessibility, best practices, usage

## Design Tokens

### Colors
```typescript
// colors.ts
export const colors = {
  // Brand colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    900: '#1e3a8a'
  },

  // Neutral colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    900: '#111827'
  },

  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
}

// Usage
const Button = styled.button`
  background-color: ${colors.primary[500]};
  color: white;

  &:hover {
    background-color: ${colors.primary[600]};
  }
`
```

### Typography
```typescript
// typography.ts
export const typography = {
  fonts: {
    sans: 'Inter, system-ui, sans-serif',
    serif: 'Georgia, serif',
    mono: 'Menlo, monospace'
  },

  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem'   // 36px
  },

  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },

  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  }
}
```

### Spacing
```typescript
// spacing.ts
export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem'     // 80px
}
```

### Shadows
```typescript
// shadows.ts
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
}
```

### Border Radius
```typescript
// borderRadius.ts
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px'    // Pill shape
}
```

## Component Library

### Button Component
```typescript
// Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
        ghost: 'hover:bg-gray-100',
        danger: 'bg-red-600 text-white hover:bg-red-700'
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-8 text-lg'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
}

// Usage
<Button variant="primary" size="lg">Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost" size="sm">Ghost</Button>
```

### Input Component
```typescript
// Input.tsx
import { forwardRef } from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={`
            w-full rounded-md border px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// Usage
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  helperText="We'll never share your email"
/>

<Input
  label="Password"
  type="password"
  error="Password is required"
/>
```

### Card Component
```typescript
// Card.tsx
export function Card({ children, className }: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-lg border bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-gray-600">{children}</div>
}

// Usage
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

## Layout Components

### Container
```typescript
// Container.tsx
export function Container({ children, size = 'default' }: {
  children: React.ReactNode
  size?: 'sm' | 'default' | 'lg' | 'full'
}) {
  const sizeClasses = {
    sm: 'max-w-3xl',
    default: 'max-w-6xl',
    lg: 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]}`}>
      {children}
    </div>
  )
}
```

### Stack
```typescript
// Stack.tsx
export function Stack({ children, spacing = 4, direction = 'vertical' }: {
  children: React.ReactNode
  spacing?: number
  direction?: 'vertical' | 'horizontal'
}) {
  const directionClass = direction === 'vertical' ? 'flex-col' : 'flex-row'
  const spacingClass = `gap-${spacing}`

  return (
    <div className={`flex ${directionClass} ${spacingClass}`}>
      {children}
    </div>
  )
}
```

## Documentation

### Component Documentation
```markdown
# Button Component

A versatile button component with multiple variants and sizes.

## Import

\`\`\`typescript
import { Button } from '@/components/ui/Button'
\`\`\`

## Usage

\`\`\`tsx
<Button>Click me</Button>
<Button variant="secondary">Secondary</Button>
<Button size="lg">Large button</Button>
<Button disabled>Disabled</Button>
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger' | 'primary' | Button style variant |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| disabled | boolean | false | Disable the button |

## Accessibility

- Keyboard accessible
- Focus visible with outline
- ARIA attributes supported

## Examples

### With Icon

\`\`\`tsx
<Button>
  <Icon name="plus" />
  Add Item
</Button>
\`\`\`

### Loading State

\`\`\`tsx
<Button disabled>
  <Spinner className="mr-2" />
  Loading...
</Button>
\`\`\`
```

## Storybook Setup

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger']
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    }
  }
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary'
  }
}

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary'
  }
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  )
}
```

## Best Practices

### Consistency
- ✅ Use design tokens everywhere
- ✅ Follow naming conventions
- ✅ Maintain component API consistency
- ✅ Document everything

### Maintainability
- ✅ Keep components small and focused
- ✅ Use composition over props explosion
- ✅ Version your design system
- ✅ Provide migration guides

### Accessibility
- ✅ Support keyboard navigation
- ✅ Include ARIA attributes
- ✅ Ensure sufficient color contrast
- ✅ Test with screen readers

### Performance
- ✅ Tree-shake unused components
- ✅ Lazy load heavy components
- ✅ Optimize bundle size
- ✅ Use CSS-in-JS efficiently

## Tools

- **Storybook**: Component documentation and testing
- **Figma**: Design collaboration
- **Tailwind CSS**: Utility-first CSS framework
- **CVA (Class Variance Authority)**: Variant management
- **Radix UI**: Unstyled accessible components
- **shadcn/ui**: Re-usable component collection
