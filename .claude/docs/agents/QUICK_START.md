# Quick Start Guide

Get up and running with the Claude Multi-Agent System in minutes.

## Prerequisites

- Node.js 20+ installed
- Git configured
- Next.js project (or willingness to create one)
- Basic familiarity with TypeScript and React

## 5-Minute Setup

### Step 1: Verify Installation

The agent system is already installed at `~/.claude/`. Verify it exists:

```bash
ls ~/.claude/
# You should see: agents/ skills/ hooks/ prompts/ docs/
```

### Step 2: Check Agent Registry

```bash
cat ~/.claude/agents/registry.json
```

This file lists all available agents.

### Step 3: Test an Agent

Try using the Main Agent:

```bash
# In your project
claude "Show me the available agents"
```

You should see a list of all 10 agents.

### Step 4: Create Your First Task

```bash
claude "Use the Task Agent to create a plan for adding user authentication"
```

The Task Agent will break down the task into steps.

### Step 5: Implement a Feature

```bash
claude "Use the Coder Agent to create a Button component"
```

The Coder Agent will create a reusable Button component.

## Common Workflows

### Workflow 1: Build a New Feature

```bash
# Step 1: Plan the feature
claude "Create a task plan for building a user dashboard"

# Step 2: Implement the feature
claude "Implement the dashboard layout with responsive design"

# Step 3: Add tests
claude "Write tests for the dashboard component"

# Step 4: Review the code
claude "Review the dashboard implementation for any issues"
```

### Workflow 2: Fix a Bug

```bash
# Step 1: Report the bug
claude "There's a bug where login redirect doesn't work after authentication"

# Step 2: Fix Agent investigates
# (Fix Agent will diagnose and fix automatically)

# Step 3: Verify the fix
claude "Test the login flow to verify the fix"
```

### Workflow 3: Improve UI/UX

```bash
# Step 1: Request UI improvements
claude "Make the homepage responsive and accessible"

# Step 2: UI/UX Agent implements
# (Automatically creates responsive, accessible design)

# Step 3: Test on different devices
claude "How should I test this on mobile devices?"
```

## Using Specific Agents

### Syntax

```bash
# General request (Main Agent decides)
claude "Add dark mode support"

# Direct agent invocation
@coder-agent "Create a theme toggle component"
@uiux-agent "Style the theme toggle"
@tester-agent "Test the theme toggle"
```

### Agent Selection Guide

| What You Want | Use This Agent | Example |
|--------------|----------------|---------|
| Plan a project | Task Agent | "Break down the auth feature" |
| Write new code | Coder Agent | "Create a login form component" |
| Fix a bug | Fix Agent | "Fix the 404 error" |
| Style UI | UI/UX Agent | "Make this responsive" |
| Write tests | Tester Agent | "Test the login flow" |
| Deploy app | Deployer Agent | "Deploy to production" |
| Write docs | Documenter Agent | "Document the API" |
| Review code | Reviewer Agent | "Review this PR" |
| Research | Web Search Agent | "Find best practices for..." |

## Project Structure

After setup, your project should have:

```
your-project/
├── app/                 # Next.js pages
├── components/          # React components
├── lib/                # Utilities
├── hooks/              # Custom hooks
├── services/           # API calls
├── types/              # TypeScript types
├── public/             # Static files
├── .env.local         # Environment variables
├── next.config.js     # Next.js config
├── tsconfig.json      # TypeScript config
└── tailwind.config.ts # Tailwind config
```

## Environment Setup

### 1. Create Environment File

```bash
cp .env.example .env.local
```

### 2. Configure Appwrite (if using)

```env
# .env.local
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
```

### 3. Configure Other Services

```env
# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Git Hooks Setup

The system includes pre-commit and pre-push hooks:

```bash
# Copy hooks to your project
cp ~/.claude/hooks/* .git/hooks/

# Make executable
chmod +x .git/hooks/*
```

Hooks will now run automatically:
- **pre-commit**: Linting, type checking
- **pre-push**: Tests, build verification
- **post-deploy**: Deployment notifications

## Testing the Setup

### Test 1: Code Generation

```bash
claude "Create a simple HomePage component that displays 'Welcome'"
```

Expected: A new component file is created.

### Test 2: Bug Fixing

```bash
claude "There's a TypeScript error in HomePage.tsx - 'text' is not defined"
```

Expected: Fix Agent identifies and fixes the error.

### Test 3: Testing

```bash
claude "Write a test for the HomePage component"
```

Expected: Test file is created with proper assertions.

### Test 4: Documentation

```bash
claude "Create a README for the HomePage component"
```

Expected: Documentation is generated.

## Next Steps

### Learn More

- Read the [Full Documentation](./README.md)
- Check out [Deployment Guide](./DEPLOYMENT.md)
- Explore [Skills](../../skills/)
- Review [Agent Prompts](../../agents/)

### Customize

- Edit `~/.claude/prompts/user-preferences.md` for your preferences
- Modify `~/.claude/prompts/system-context.md` for project context
- Add custom skills to `~/.claude/skills/`

### Best Practices

1. **Start Simple**: Use Main Agent for complex tasks
2. **Be Specific**: Clear requests get better results
3. **Iterate**: Refine based on output
4. **Review**: Always review generated code
5. **Test**: Run tests after changes

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm test                # Run tests
npm run lint            # Lint code

# Git
git status              # Check status
git add .               # Stage changes
git commit -m "message" # Commit
git push                # Push changes

# Claude Agents
claude "request"        # General request
@agent-name "request"   # Specific agent
```

## Troubleshooting

### Issue: Agent not found

**Solution**: Check agent registry

```bash
cat ~/.claude/agents/registry.json
```

### Issue: MCP server error

**Solution**: Verify MCP configuration

```bash
cat ~/.claude/agents/main-agent/mcp.json
```

### Issue: Context too large

**Solution**: Reduce context in `context.json`

```json
{
  "contextWindow": 100000,  // Reduce this
  "includeFiles": ["**/*.tsx"]  // Be more specific
}
```

### Issue: Slow response

**Solution**: Use more specific agent

```bash
# Instead of:
claude "Fix everything"

# Use:
@fix-agent "Fix the login bug"
```

## Getting Help

- **Documentation**: Read the [full docs](./README.md)
- **Examples**: Check `examples/` directory
- **Community**: Join the discussion
- **Issues**: Report bugs on GitHub

## What's Next?

You're ready to start using the multi-agent system! Here are some ideas:

1. ✅ Build a new feature end-to-end
2. ✅ Refactor existing code for better quality
3. ✅ Add comprehensive test coverage
4. ✅ Improve accessibility and performance
5. ✅ Deploy to production

Happy coding! 🚀
