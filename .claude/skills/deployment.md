# Deployment Skill

Expert knowledge of deploying web applications to production.

## Pre-Deployment Checklist

### Code Quality
- ✅ All tests passing
- ✅ No TypeScript errors
- ✅ Linting passes
- ✅ Build succeeds locally
- ✅ No console errors or warnings

### Security
- ✅ No hardcoded secrets or API keys
- ✅ Environment variables configured
- ✅ HTTPS enabled
- ✅ Security headers configured
- ✅ Dependencies up-to-date

### Performance
- ✅ Images optimized
- ✅ Bundle size analyzed
- ✅ Lighthouse score > 90
- ✅ Lazy loading implemented
- ✅ Caching configured

## Deployment Strategies

### Blue-Green Deployment
- Run two identical environments (blue and green)
- Deploy to inactive environment
- Test thoroughly
- Switch traffic to new environment
- Keep old environment for quick rollback

### Canary Deployment
- Deploy to small subset of users first
- Monitor metrics and errors
- Gradually increase traffic
- Full rollout if successful
- Quick rollback if issues detected

### Rolling Deployment
- Update servers one at a time
- Maintain service availability
- Automated health checks
- Rollback failed deployments

## Platform-Specific

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
```

### Docker Deployment
```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

## CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}

      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Environment Management

### Environment Variables
```bash
# .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://localhost:5432/dev

# .env.production (production)
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://prod-db:5432/prod
```

### Secrets Management
- Use platform-specific secret managers (Vercel Secrets, GitHub Secrets)
- Rotate secrets regularly
- Never commit secrets to version control
- Use different secrets for each environment

## Monitoring

### Post-Deployment Checks
1. Check application loads correctly
2. Verify API endpoints respond
3. Test user authentication
4. Check database connections
5. Review error logs
6. Monitor performance metrics

### Tools
- **Error Tracking**: Sentry, Bugsnag
- **Performance**: Vercel Analytics, Google Analytics
- **Uptime**: UptimeRobot, Pingdom
- **Logs**: Logtail, Papertrail

## Rollback Strategy

### Quick Rollback
```bash
# Vercel - promote previous deployment
vercel promote [deployment-url] --prod

# Git - revert commit
git revert HEAD
git push origin main
```

### Database Rollback
- Maintain database backups
- Test rollback procedures regularly
- Use migrations with down scripts
- Keep schema changes backward compatible

## Performance Monitoring

### Key Metrics
- **TTFB**: Time to First Byte (< 600ms)
- **FCP**: First Contentful Paint (< 1.8s)
- **LCP**: Largest Contentful Paint (< 2.5s)
- **TTI**: Time to Interactive (< 3.8s)
- **CLS**: Cumulative Layout Shift (< 0.1)

### Optimization
- Enable CDN caching
- Use edge functions
- Implement service workers
- Optimize images and fonts
- Minimize JavaScript bundles

## Common Issues

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies installed
- Review environment variables
- Check for TypeScript errors

### Runtime Errors
- Review application logs
- Check API connectivity
- Verify environment variables in production
- Test database connections

### Performance Issues
- Analyze bundle size
- Check for memory leaks
- Review database query performance
- Optimize images and assets
