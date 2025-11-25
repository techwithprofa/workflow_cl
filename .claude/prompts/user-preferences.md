# User Preferences

This file contains user-specific preferences and customizations for Claude agents.

## Communication Preferences

### Verbosity
- **Level**: Balanced
- Provide enough detail to be helpful
- Don't over-explain simple concepts
- Include examples for complex topics
- Ask for clarification when needed

### Tone
- Professional but friendly
- Direct and to the point
- Acknowledge mistakes if they occur
- Explain reasoning when making decisions

### Code Style
- **Comments**: Only for complex logic (code should be self-documenting)
- **Formatting**: Follow project's Prettier config
- **TypeScript**: Always use strict typing
- **Naming**: Descriptive over concise

## Workflow Preferences

### Task Management
- Use TodoWrite for multi-step tasks
- Break large tasks into manageable chunks
- Update progress in real-time
- Mark tasks complete immediately after finishing

### Git and Version Control
- Commit messages follow Conventional Commits
- Create feature branches for new work
- Never force push to main branch
- Include descriptive commit messages

### Code Review
- Highlight security issues as critical
- Point out performance concerns
- Suggest improvements with explanations
- Acknowledge good code patterns

## Technology Stack Preferences

### Primary Technologies
- **Frontend**: Next.js 14+, React, TypeScript, Tailwind CSS
- **Backend**: Appwrite (authentication, database, storage)
- **Deployment**: Vercel
- **Testing**: Jest, React Testing Library, Playwright
- **Linting**: ESLint with strict rules
- **Formatting**: Prettier

### Library Preferences
- **State Management**: React hooks, Context API, or Zustand for complex state
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: SWR or React Query for client-side
- **UI Components**: shadcn/ui or build from scratch
- **Icons**: Lucide React
- **Date Handling**: date-fns (avoid moment.js)
- **Utilities**: Lodash for complex operations

### Avoid Unless Necessary
- Redux (prefer simpler state solutions)
- Class components (use functional with hooks)
- CSS-in-JS libraries (prefer Tailwind)
- jQuery (use modern JavaScript)
- Moment.js (use date-fns instead)

## Development Environment

### Tools
- **Editor**: VS Code assumed
- **Package Manager**: npm (unless yarn.lock exists)
- **Node Version**: LTS (20+)
- **Browser**: Modern browsers (Chrome, Firefox, Safari, Edge)

### Extensions (Recommended)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Error Translator
- GitLens

## Code Generation Preferences

### When Writing Components
1. Use functional components with TypeScript
2. Define proper TypeScript interfaces for props
3. Include prop types and default values
4. Add JSDoc comments for complex props
5. Handle loading and error states
6. Consider accessibility (ARIA, keyboard nav)

### When Writing Functions
1. Use TypeScript with proper types
2. Keep functions focused and small
3. Handle edge cases
4. Add error handling where appropriate
5. Consider performance implications
6. Write testable code

### When Writing Tests
1. Test behavior, not implementation
2. Use descriptive test names
3. Follow AAA pattern (Arrange, Act, Assert)
4. Cover happy path and edge cases
5. Mock external dependencies appropriately
6. Keep tests maintainable

## Problem-Solving Approach

### When Debugging
1. Read error messages carefully
2. Check recent changes first
3. Reproduce the issue
4. Isolate the problem
5. Test the fix
6. Verify no regressions

### When Implementing Features
1. Understand requirements fully
2. Plan the implementation
3. Start with smallest working solution
4. Iterate and improve
5. Write tests
6. Document if needed

### When Refactoring
1. Ensure tests exist first
2. Make small, incremental changes
3. Run tests after each change
4. Keep behavior unchanged
5. Improve one thing at a time
6. Commit frequently

## Learning and Improvement

### When Uncertain
- Admit uncertainty honestly
- Research official documentation
- Look for recent best practices
- Suggest multiple approaches when applicable
- Learn from mistakes

### When Suggesting Solutions
- Explain the "why" not just the "how"
- Consider trade-offs
- Suggest alternatives when relevant
- Link to documentation
- Provide examples

## Project-Specific Preferences

### This Project
- Mobile-first responsive design
- Dark mode support (if applicable)
- Internationalization ready (if applicable)
- SEO optimized
- Performance focused (Core Web Vitals)

### Quality Standards
- **Performance**: Lighthouse score > 90
- **Accessibility**: WCAG 2.1 AA compliance
- **Test Coverage**: > 80% on critical paths
- **Type Coverage**: 100% (no any types)
- **Bundle Size**: Monitor and optimize

## Feedback and Iteration

### Continuous Improvement
- Learn from code reviews
- Adapt to project patterns
- Update conventions as project evolves
- Share knowledge with team
- Document lessons learned

### When Things Go Wrong
- Own mistakes
- Learn from them
- Share solutions
- Update documentation
- Prevent recurrence

---

**Note**: These preferences can be updated as the project evolves. Always prioritize project-specific conventions over personal preferences.
