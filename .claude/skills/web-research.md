# Web Research Skill

Expert knowledge of researching technical information and finding solutions online.

## Search Strategies

### Effective Query Construction
```
# Be specific
Bad:  "react error"
Good: "react useEffect cleanup function not called"

# Include version numbers
"Next.js 14 server actions tutorial"
"TypeScript 5.0 new features"

# Use exact phrases
"Module not found: Can't resolve 'fs'"
Error: "cannot read property 'map' of undefined"

# Exclude unwanted results
react hooks -class -redux

# Search specific sites
site:stackoverflow.com react context performance
site:github.com next.js issues cache

# Search by file type
filetype:pdf typescript design patterns
filetype:md nextjs documentation
```

### Advanced Search Operators
```
# OR operator
(react OR vue) state management

# Wildcard
"how to * in typescript"

# Number range
react tutorial 2023..2024

# Related sites
related:reactjs.org

# Time range
react hooks tutorial after:2023
```

## Trusted Sources

### Documentation
1. **Official Docs** (Always start here)
   - Next.js: nextjs.org/docs
   - React: react.dev
   - TypeScript: typescriptlang.org
   - MDN: developer.mozilla.org

2. **GitHub Repositories**
   - Official repos
   - Check issues and discussions
   - Read source code
   - Review pull requests

3. **npm Package Pages**
   - README documentation
   - Check last publish date
   - Review download stats
   - Check for security advisories

### Community Resources
1. **Stack Overflow**
   - Look for accepted answers
   - Check answer date (recent is better)
   - Read comments for updates
   - Check answer votes

2. **Dev.to / Medium**
   - Filter by publication date
   - Check author credentials
   - Verify code examples work

3. **Reddit**
   - r/reactjs
   - r/nextjs
   - r/typescript
   - r/webdev

4. **Discord/Slack Communities**
   - Official framework communities
   - Real-time help
   - Direct from maintainers

### Video Tutorials
- YouTube channels by reputable developers
- Official framework channels
- Conference talks (React Conf, Next.js Conf)
- Verify tutorial is recent

## Evaluating Information

### Check Credibility
```
✅ Official documentation
✅ Verified author/maintainer
✅ Recent publication date
✅ Multiple sources agree
✅ Working code examples
✅ Proper explanations (not just code)

❌ Outdated (>2 years old for JS/TS)
❌ No explanation
❌ Copy-pasted without attribution
❌ No version specified
❌ Clickbait titles
❌ Too good to be true
```

### Verify Solutions
```typescript
// Before using code from internet:

// 1. Understand what it does
function mysteryFunction(x: any) { /* ... */ }
// Don't use if you don't understand it!

// 2. Check for security issues
eval(userInput) // ❌ Never do this!
new Function(untrustedCode)() // ❌ Dangerous!

// 3. Check for performance issues
while(true) { /* ... */ } // ❌ Infinite loop?
array.forEach(() => {
  database.query() // ❌ N+1 query problem?
})

// 4. Check for deprecation
componentWillMount() // ❌ Deprecated in React
moment.js // ❌ Consider date-fns or dayjs

// 5. Test before using in production
// Create minimal reproduction
// Test edge cases
// Check error handling
```

## Troubleshooting Process

### 1. Read the Error Message
```
Error: Cannot find module 'fs'

# Break it down:
- What: Cannot find module
- Which module: 'fs'
- Where: Check the stack trace
- Why: Importing Node.js module in browser?
```

### 2. Check Recent Changes
```bash
# What changed?
git diff HEAD~1

# What was the last working commit?
git log --oneline

# Any new dependencies?
git diff HEAD~1 package.json
```

### 3. Search for Exact Error
```
# Copy exact error message
search: Module not found: Can't resolve 'fs'

# Add context
search: Next.js Module not found: Can't resolve 'fs' server component

# Add version
search: Next.js 14 Module not found: Can't resolve 'fs'
```

### 4. Check Known Issues
```
# GitHub issues
site:github.com/vercel/next.js issues "Module not found"

# Check if it's a known bug
# Look for open issues
# Check if there's a workaround
# See if it's fixed in next version
```

### 5. Minimal Reproduction
```typescript
// Isolate the problem
// Create smallest possible example that shows the bug

// Bad: Entire application
// Good: Single component/function

// Share on CodeSandbox or StackBlitz
// Makes it easier for others to help
```

## Finding Libraries

### Evaluating npm Packages
```
✅ Regular updates (recently maintained)
✅ Good documentation
✅ Active GitHub issues/PRs
✅ TypeScript types included or available
✅ Reasonable bundle size
✅ No critical security vulnerabilities
✅ Good test coverage
✅ Compatible with your framework version

❌ Last update >2 years ago
❌ No documentation
❌ Many open issues, no responses
❌ No TypeScript support
❌ Huge bundle size
❌ Security vulnerabilities
❌ No tests
```

### Tools for Package Research
- **bundlephobia.com**: Check bundle size
- **npmtrends.com**: Compare package popularity
- **snyk.io**: Check for vulnerabilities
- **npm.devtool.tech**: View package details
- **openbase.com**: Package comparison

## Research Workflow

### For New Feature
```
1. Check official documentation first
2. Search for "best practices [feature]"
3. Look for official examples
4. Check GitHub for similar implementations
5. Read blog posts from trusted sources
6. Watch conference talks if available
7. Review popular open-source projects
8. Test approaches in isolated environment
```

### For Bug/Error
```
1. Read error message carefully
2. Check what changed recently
3. Search exact error message
4. Check GitHub issues
5. Search Stack Overflow
6. Try to reproduce in isolation
7. Read related documentation
8. Ask in community if stuck
```

### For Performance Issue
```
1. Profile to identify bottleneck
2. Research "optimize [specific-issue]"
3. Check official performance docs
4. Look for common patterns/anti-patterns
5. Test different approaches
6. Measure impact of changes
```

## Asking for Help

### Write Good Questions
```markdown
# Bad Question
"My React app doesn't work. Help!"

# Good Question
## Problem
Next.js 14 build fails with "Module not found: Can't resolve 'fs'"

## Context
- Next.js version: 14.0.3
- Node version: 20.10.0
- Trying to import 'fs' in a Server Component

## What I Tried
1. Checked next.config.js
2. Verified it's a Server Component (no 'use client')
3. Tried dynamic import

## Code
\`\`\`typescript
// app/page.tsx
import fs from 'fs'

export default async function Page() {
  const files = fs.readdirSync('./data')
  return <div>{files.length} files</div>
}
\`\`\`

## Error
\`\`\`
Module not found: Can't resolve 'fs'
\`\`\`

## Question
Why can't I import 'fs' in a Server Component? According to the docs, Server Components can access Node.js APIs.
```

### Include
- ✅ Exact error message
- ✅ Minimal reproduction
- ✅ What you've tried
- ✅ Relevant versions
- ✅ Expected vs actual behavior
- ✅ Code example

### Don't
- ❌ Share entire codebase
- ❌ Use vague descriptions
- ❌ Omit error messages
- ❌ Skip what you've tried
- ❌ Demand immediate answers
- ❌ Cross-post everywhere

## Staying Updated

### Follow
- Framework release notes
- Official blogs
- Key maintainers on Twitter/X
- Conference talks
- Weekly newsletters (React Status, JavaScript Weekly)

### RSS Feeds
- Official blogs
- Reputable dev blogs
- GitHub release pages

### Newsletters
- React Newsletter
- TypeScript Weekly
- Next.js Newsletter
- JavaScript Weekly

## Research Checklist

- ✅ Start with official documentation
- ✅ Check publication/update date
- ✅ Verify information with multiple sources
- ✅ Test code examples before using
- ✅ Check for security issues
- ✅ Consider performance implications
- ✅ Verify version compatibility
- ✅ Read comments/discussions
- ✅ Check for deprecation warnings
- ✅ Understand before implementing
