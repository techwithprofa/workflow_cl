# Deployment Guide

Complete guide for deploying your Next.js application with the Claude Multi-Agent System.

## Overview

This guide covers deployment to Vercel (recommended) and includes configuration for the agent system in production environments.

## Pre-Deployment Checklist

### Code Quality

- ✅ All tests passing (`npm test`)
- ✅ Build succeeds (`npm run build`)
- ✅ No TypeScript errors (`npx tsc --noEmit`)
- ✅ Linting passes (`npm run lint`)
- ✅ Code reviewed and approved

### Security

- ✅ No secrets in code
- ✅ Environment variables configured
- ✅ Dependencies updated
- ✅ Security audit passed (`npm audit`)
- ✅ .env files in .gitignore

### Performance

- ✅ Images optimized
- ✅ Lighthouse score > 90
- ✅ Bundle size optimized
- ✅ Core Web Vitals acceptable

## Vercel Deployment

### Initial Setup

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login to Vercel

```bash
vercel login
```

#### 3. Link Project

```bash
# From your project directory
vercel link
```

Follow the prompts to create or link to a Vercel project.

### Environment Variables

#### Set Production Variables

```bash
# Set environment variables
vercel env add NEXT_PUBLIC_APPWRITE_ENDPOINT production
vercel env add NEXT_PUBLIC_APPWRITE_PROJECT_ID production
vercel env add DATABASE_URL production
```

Or use the Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add each variable with appropriate value
3. Select "Production" environment

#### Required Variables

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id

# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=Your App Name

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Deploy to Production

#### Manual Deployment

```bash
# Deploy to production
vercel --prod
```

#### Automatic Deployment (Recommended)

1. **Connect GitHub Repository**
   - Go to Vercel Dashboard
   - Import Git Repository
   - Connect your GitHub repo

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Set Up Automatic Deployments**
   - Production: Deploys on push to `main` branch
   - Preview: Deploys on push to any branch
   - Merge: Deploys on PR merge

### Custom Domain

#### Add Domain

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. Wait for DNS propagation (up to 48 hours)

#### SSL Certificate

Vercel automatically provisions SSL certificates. No action needed!

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npx tsc --noEmit

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  build:
    runs-on: ubuntu-latest
    needs: test

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_APPWRITE_ENDPOINT: ${{ secrets.NEXT_PUBLIC_APPWRITE_ENDPOINT }}
          NEXT_PUBLIC_APPWRITE_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_APPWRITE_PROJECT_ID }}

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Required Secrets

Add these to GitHub Repository Settings → Secrets:

- `VERCEL_TOKEN`: From Vercel Account Settings → Tokens
- `VERCEL_ORG_ID`: From `.vercel/project.json`
- `VERCEL_PROJECT_ID`: From `.vercel/project.json`
- `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID`

## Post-Deployment

### Verify Deployment

```bash
# Check deployment status
vercel inspect <deployment-url>

# View logs
vercel logs <deployment-url>
```

### Health Checks

1. **Smoke Tests**
   ```bash
   curl https://yourdomain.com/api/health
   ```

2. **Critical Paths**
   - Test login flow
   - Verify API endpoints
   - Check database connectivity
   - Test file uploads

3. **Performance**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Monitor response times

### Monitoring

#### Vercel Analytics

Enable in Project Settings → Analytics

Tracks:
- Page views
- Unique visitors
- Performance metrics
- Geographic distribution

#### Error Tracking

Set up Sentry:

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
})
```

#### Custom Monitoring

Create health check endpoint:

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  }

  // Check database
  try {
    // await db.ping()
    health.database = 'connected'
  } catch (error) {
    health.database = 'error'
    health.status = 'unhealthy'
  }

  const status = health.status === 'healthy' ? 200 : 503
  return NextResponse.json(health, { status })
}
```

## Rollback Procedures

### Vercel Rollback

#### Via Dashboard

1. Go to Deployments
2. Find previous stable deployment
3. Click "..." → "Promote to Production"

#### Via CLI

```bash
# List recent deployments
vercel ls

# Promote specific deployment
vercel promote <deployment-url> --prod
```

### Git Rollback

```bash
# Revert last commit
git revert HEAD
git push origin main

# Rollback to specific commit
git reset --hard <commit-hash>
git push --force origin main  # Use with caution!
```

## Staging Environment

### Create Staging Project

```bash
# Deploy to staging
vercel --scope=your-team --project=your-project-staging
```

### Staging Configuration

```env
# .env.staging
NEXT_PUBLIC_APP_URL=https://staging.yourdomain.com
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://staging-api.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=staging_project_id
```

### Workflow

```
feature-branch → staging → main → production
```

## Database Migrations

### Before Deployment

```bash
# Run migrations locally
npm run db:migrate

# Verify migrations
npm run db:status
```

### During Deployment

Use Vercel's Build Command:

```json
{
  "buildCommand": "npm run db:migrate && npm run build"
}
```

### Rollback Plan

- Keep migrations reversible
- Test rollback procedure
- Backup database before major migrations

## Performance Optimization

### Vercel Configuration

```javascript
// next.config.js
module.exports = {
  // Enable compression
  compress: true,

  // Optimize images
  images: {
    domains: ['yourdomain.com'],
    formats: ['image/avif', 'image/webp']
  },

  // Enable SWC minification
  swcMinify: true,

  // Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains'
          }
        ]
      }
    ]
  }
}
```

### CDN Configuration

Vercel automatically configures CDN, but you can optimize:

```javascript
// Cache static assets
export const config = {
  runtime: 'edge'
}
```

## Troubleshooting

### Build Failures

**Issue**: Build fails with "Module not found"

**Solution**:
```bash
# Clear cache
vercel build --debug

# Check dependencies
npm ci
```

**Issue**: Environment variable not found

**Solution**:
```bash
# Verify variables are set
vercel env ls

# Pull environment variables
vercel env pull
```

### Runtime Errors

**Issue**: 500 Internal Server Error

**Solution**:
```bash
# Check logs
vercel logs <deployment-url> --follow

# Check function logs
vercel logs <deployment-url> --output=raw
```

**Issue**: API route timeout

**Solution**:
- Increase function timeout (Pro plan)
- Optimize database queries
- Use Edge Functions for better performance

## Security

### Security Headers

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
  }
]
```

### Rate Limiting

Implement rate limiting for API routes:

```typescript
// lib/rate-limit.ts
import { NextResponse } from 'next/server'

const rateLimit = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string, limit: number = 10) {
  const now = Date.now()
  const record = rateLimit.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimit.set(identifier, {
      count: 1,
      resetTime: now + 60000 // 1 minute
    })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}
```

## Best Practices

- ✅ Deploy during low-traffic periods
- ✅ Monitor for 15-30 minutes post-deployment
- ✅ Have rollback plan ready
- ✅ Test in staging first
- ✅ Use feature flags for risky changes
- ✅ Keep deployments small and frequent
- ✅ Automate deployment process
- ✅ Document deployment procedures

## Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- Contact Vercel Support (Pro plan)

---

Happy Deploying! 🚀
