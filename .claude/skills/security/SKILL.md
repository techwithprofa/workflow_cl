---
name: security
description: Security best practices, vulnerability prevention, and secure coding guidelines
---

# Security Skill


Expert knowledge of web application security and protecting against common vulnerabilities.

## OWASP Top 10

### 1. Broken Access Control
**Problem**: Users can access unauthorized resources

**Prevention**:
```typescript
// Server-side authorization check
export async function getUser(userId: string, requesterId: string) {
  if (userId !== requesterId && !isAdmin(requesterId)) {
    throw new Error('Unauthorized')
  }
  return await db.users.findUnique({ where: { id: userId } })
}

// Next.js API route
export async function GET(request: Request) {
  const session = await getSession(request)
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }
  // Verify user can access this resource
}
```

### 2. Cryptographic Failures
**Problem**: Sensitive data exposure

**Prevention**:
```typescript
// Use HTTPS only
// Encrypt sensitive data at rest
import bcrypt from 'bcryptjs'

const hashedPassword = await bcrypt.hash(password, 10)
const isValid = await bcrypt.compare(password, hashedPassword)

// Use environment variables for secrets
const apiKey = process.env.API_KEY
```

### 3. Injection (SQL, NoSQL, Command)
**Problem**: Malicious code execution

**Prevention**:
```typescript
// Use parameterized queries
const user = await db.user.findUnique({
  where: { email: email } // Prisma auto-escapes
})

// Never concatenate user input
// BAD: `SELECT * FROM users WHERE email = '${email}'`

// Validate and sanitize input
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(120)
})

const validated = schema.parse(userInput)
```

### 4. Insecure Design
**Problem**: Missing or ineffective security controls

**Prevention**:
- Implement rate limiting
- Use multi-factor authentication
- Employ least privilege principle
- Secure by default configurations

### 5. Security Misconfiguration
**Problem**: Insecure default settings

**Prevention**:
```typescript
// Security headers (Next.js)
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  }
]

// next.config.js
module.exports = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  }
}
```

### 6. Vulnerable Components
**Problem**: Using components with known vulnerabilities

**Prevention**:
```bash
# Regularly audit dependencies
npm audit
npm audit fix

# Use tools like Snyk or Dependabot
# Keep dependencies up to date
# Remove unused dependencies
```

### 7. Authentication Failures
**Problem**: Weak authentication mechanisms

**Prevention**:
```typescript
// Strong password requirements
const passwordSchema = z.string()
  .min(12, 'At least 12 characters')
  .regex(/[A-Z]/, 'At least one uppercase letter')
  .regex(/[a-z]/, 'At least one lowercase letter')
  .regex(/[0-9]/, 'At least one number')
  .regex(/[^A-Za-z0-9]/, 'At least one special character')

// Implement rate limiting
const attempts = await redis.incr(`login:${ip}`)
await redis.expire(`login:${ip}`, 3600)
if (attempts > 5) {
  throw new Error('Too many attempts')
}

// Session management
const session = await getSession()
session.regenerate() // Prevent session fixation
```

### 8. Software and Data Integrity Failures
**Problem**: Untrusted code execution

**Prevention**:
- Use subresource integrity (SRI) for CDN scripts
- Verify signatures of packages
- Use lock files (package-lock.json)
- Implement code signing

### 9. Security Logging Failures
**Problem**: Insufficient logging and monitoring

**Prevention**:
```typescript
// Log security events
logger.warn('Failed login attempt', {
  email,
  ip: request.ip,
  userAgent: request.headers['user-agent']
})

// Monitor for suspicious activity
// Set up alerts for unusual patterns
// Regularly review logs
```

### 10. Server-Side Request Forgery (SSRF)
**Problem**: Server makes unintended requests

**Prevention**:
```typescript
// Validate URLs
const url = new URL(userProvidedUrl)
if (!['http:', 'https:'].includes(url.protocol)) {
  throw new Error('Invalid protocol')
}
if (url.hostname === 'localhost' || url.hostname.startsWith('192.168.')) {
  throw new Error('Invalid hostname')
}

// Use allowlist of domains
const allowedDomains = ['api.example.com']
if (!allowedDomains.includes(url.hostname)) {
  throw new Error('Domain not allowed')
}
```

## Cross-Site Scripting (XSS)

### Prevention
```typescript
// React escapes by default
<div>{userInput}</div> // Safe

// Dangerous
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // Avoid!

// If you must render HTML, sanitize it
import DOMPurify from 'dompurify'
const clean = DOMPurify.sanitize(dirty)
```

## Cross-Site Request Forgery (CSRF)

### Prevention
```typescript
// Use SameSite cookies
res.setHeader('Set-Cookie', 'sessionId=abc; SameSite=Strict; Secure; HttpOnly')

// CSRF tokens for state-changing operations
// Next.js with next-auth handles this automatically
```

## Content Security Policy (CSP)

```typescript
const csp = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-eval'", 'https://trusted-cdn.com'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'"],
  'connect-src': ["'self'", 'https://api.example.com'],
  'frame-ancestors': ["'none'"]
}
```

## Authentication Best Practices

### Password Storage
```typescript
// NEVER store plain text passwords
// Use bcrypt, scrypt, or Argon2
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
```

### JWT Tokens
```typescript
import jwt from 'jsonwebtoken'

// Sign token
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
)

// Verify token
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
} catch (error) {
  throw new Error('Invalid token')
}
```

### Session Management
- Use secure, httpOnly cookies
- Implement session timeout
- Regenerate session ID after login
- Clear session on logout

## API Security

### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests'
})

app.use('/api/', limiter)
```

### Input Validation
```typescript
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email().max(255),
  age: z.number().int().min(0).max(150),
  role: z.enum(['user', 'admin'])
})

try {
  const validated = userSchema.parse(input)
} catch (error) {
  return res.status(400).json({ error: error.errors })
}
```

## Environment Variables

```bash
# .env (NEVER commit this)
DATABASE_URL=postgresql://user:password@localhost:5432/db
JWT_SECRET=long-random-string-at-least-32-characters
API_KEY=secret-api-key

# .env.example (commit this)
DATABASE_URL=
JWT_SECRET=
API_KEY=
```

## Security Checklist

- ✅ Use HTTPS everywhere
- ✅ Set security headers
- ✅ Validate and sanitize all input
- ✅ Use parameterized queries
- ✅ Hash passwords with bcrypt
- ✅ Implement rate limiting
- ✅ Enable CORS selectively
- ✅ Keep dependencies updated
- ✅ Use environment variables for secrets
- ✅ Implement proper authorization
- ✅ Log security events
- ✅ Regular security audits
