---
name: vercel
description: Vercel platform knowledge for deployment, previews, and serverless functions
---

# Vercel Skill


Expert knowledge of Vercel platform for deploying Next.js applications.

## Core Features

### Deployments
- **Production**: Deploys from main/master branch
- **Preview**: Automatic preview for each PR
- **Development**: Local development with `vercel dev`
- **Instant Rollback**: Revert to any previous deployment

### Configuration
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

## Best Practices

### Environment Variables
- Use `.env.local` for local development
- Set production variables in Vercel dashboard
- Prefix with `NEXT_PUBLIC_` for client-side access
- Use `@vercel/env` for validation

### Edge Functions
- Deploy serverless functions to edge network
- Use for auth, redirects, and API routes
- Lower latency with global distribution
- Automatic scaling

### Performance Optimization
- Enable Edge Caching for static assets
- Use ISR for dynamic content with caching
- Implement proper revalidation strategies
- Use Vercel Analytics for insights

### Domain Management
- Custom domains with automatic SSL
- Preview URLs for each deployment
- Branch-based preview URLs
- Wildcard domains for multi-tenancy

## Deployment Workflow

### Automatic Deployments
1. Push to branch → Vercel detects changes
2. Build starts automatically
3. Preview deployment created
4. Production deployment on merge to main

### Manual Deployments
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod

# Deploy with specific environment
vercel --env staging
```

## Monitoring & Analytics

### Vercel Analytics
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Page speed insights
- Regional performance data

### Logs & Debugging
- Real-time function logs
- Error tracking and alerts
- Request/response inspection
- Build logs for troubleshooting

## Security

### Security Headers
- Content Security Policy (CSP)
- CORS configuration
- Rate limiting
- DDoS protection

### Authentication
- Use Vercel's authentication helpers
- Integrate with auth providers
- Secure API routes with middleware
- Implement proper RBAC

## CI/CD Integration

### GitHub Integration
- Automatic preview deployments
- PR comments with preview URLs
- Production protection rules
- Deployment status checks

### Deployment Protection
- Password protection for previews
- Team access controls
- Deployment approval workflow
- Environment-specific permissions

## Cost Optimization
- Monitor bandwidth usage
- Optimize function execution time
- Use edge caching effectively
- Clean up old deployments
- Choose appropriate plan tier
