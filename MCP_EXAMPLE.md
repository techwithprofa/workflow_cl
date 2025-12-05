# MCP Agent Orchestration Example

This example demonstrates how to use the Agent Orchestrator MCP server to coordinate multiple agents for a complex task.

## 📋 Scenario: Building a Blog Platform

Let's build a simple blog platform using multiple coordinated agents.

### Step 1: Plan the Project

```javascript
// Use the task-agent to create a plan
await call_task_agent({
  task: "Create a project plan for a blog platform",
  context: {
    features: [
      "User authentication",
      "Create/edit/delete posts",
      "Comment system",
      "Admin dashboard",
      "SEO optimization"
    ],
    timeline: "3 weeks",
    tech_stack: "Next.js, TypeScript, MongoDB, Tailwind CSS"
  }
});
```

### Step 2: Design the Database Architecture

```javascript
await call_coder_agent({
  task: "Design database schema for blog platform",
  context: {
    collections: ["users", "posts", "comments", "categories"],
    relationships: "posts -> users (author), comments -> posts, comments -> users",
    indexes: ["email", "slug", "published_at"]
  }
});
```

### Step 3: Design the UI/UX

```javascript
await call_uiux_agent({
  task: "Design mockups for blog platform",
  context: {
    pages: [
      "Home page (post listings)",
      "Post detail page",
      "Create/edit post form",
      "User dashboard",
      "Admin panel"
    ],
    design_system: "Modern, clean, mobile-first",
    components: ["Navigation", "Card", "Button", "Form", "Modal"]
  }
});
```

### Step 4: Implement Authentication

```javascript
await call_coder_agent({
  task: "Implement authentication system",
  context: {
    auth_method: "JWT tokens",
    features: ["Register", "Login", "Logout", "Password reset"],
    middleware: "Protected routes",
    security: "bcrypt for passwords, rate limiting"
  }
});
```

### Step 5: Create Post Management

```javascript
await call_coder_agent({
  task: "Implement CRUD operations for blog posts",
  context: {
    operations: ["Create", "Read", "Update", "Delete"],
    features: [
      "Rich text editor",
      "Draft/published status",
      "SEO meta tags",
      "Featured image upload"
    ],
    api_endpoints: ["/api/posts", "/api/posts/:id"]
  }
});
```

### Step 6: Write Tests

```javascript
await call_tester_agent({
  task: "Create comprehensive test suite",
  context: {
    test_types: {
      unit: "Test individual functions and components",
      integration: "Test API endpoints",
      e2e: "Test user workflows"
    },
    coverage_target: "90%",
    testing_tools: "Jest, React Testing Library, Playwright"
  }
});
```

### Step 7: Document the API

```javascript
await call_documenter_agent({
  task: "Create API documentation",
  context: {
    documentation_type: "OpenAPI/Swagger",
    include_examples: true,
    sections: [
      "Authentication",
      "Posts API",
      "Users API",
      "Comments API",
      "Error handling"
    ]
  }
});
```

### Step 8: Security Review

```javascript
await call_reviewer_agent({
  task: "Perform security review",
  context: {
    focus_areas: [
      "SQL injection prevention",
      "XSS protection",
      "CSRF tokens",
      "Input validation",
      "Authentication security"
    ],
    security_standards: "OWASP Top 10"
  }
});
```

### Step 9: Deploy to Production

```javascript
await call_deployer_agent({
  task: "Deploy blog platform to production",
  context: {
    platform: "Vercel",
    environment_variables: "DATABASE_URL, JWT_SECRET, NEXTAUTH_URL",
    deployment_steps: [
      "Configure environment",
      "Run migrations",
      "Deploy frontend",
      "Monitor deployment"
    ]
  }
});
```

## 🔄 Complete Workflow Example

```javascript
// Main agent coordinating the entire build process
async function buildBlogPlatform() {
  // Track progress
  await TodoWrite({
    todos: [
      { content: "Plan project architecture", status: "pending", activeForm: "Planning project" },
      { content: "Design database schema", status: "pending", activeForm: "Waiting to design database" },
      { content: "Create UI/UX designs", status: "pending", activeForm: "Waiting for designs" },
      { content: "Implement authentication", status: "pending", activeForm: "Waiting to implement auth" },
      { content: "Build post management", status: "pending", activeForm: "Waiting to build features" },
      { content: "Write tests", status: "pending", activeForm: "Waiting to write tests" },
      { content: "Create documentation", status: "pending", activeForm: "Waiting for documentation" },
      { content: "Security review", status: "pending", activeForm: "Waiting for security review" },
      { content: "Deploy to production", status: "pending", activeForm: "Waiting for deployment" }
    ]
  });

  try {
    // Execute each step
    const plan = await call_task_agent({ ... });
    await TodoWrite({ todos: [..., { content: "Plan project architecture", status: "completed", activeForm: "Planned project" }] });

    const db = await call_coder_agent({ ... });
    await TodoWrite({ todos: [..., { content: "Design database schema", status: "completed", activeForm: "Designed database" }] });

    const ui = await call_uiux_agent({ ... });
    await TodoWrite({ todos: [..., { content: "Create UI/UX designs", status: "completed", activeForm: "Created designs" }] });

    // ... continue with all steps

    console.log("✅ Blog platform built successfully!");
  } catch (error) {
    // Handle errors with fix-agent
    await call_fix_agent({
      task: "Fix errors encountered during build",
      context: { error: error.message }
    });
  }
}
```

## 🎯 Key Benefits

1. **Specialization**: Each agent handles what it does best
2. **Parallel Execution**: Some tasks can run simultaneously
3. **Context Sharing**: Information flows between agents
4. **Quality Assurance**: Each step is validated by specialists
5. **Documentation**: Everything is documented automatically
6. **Traceability**: Clear audit trail of who did what

## 📝 Best Practices

1. **Clear Tasks**: Be specific about what each agent should do
2. **Context Passing**: Share relevant information between agents
3. **Error Handling**: Always check agent responses
4. **Progress Tracking**: Use TodoWrite to track complex workflows
5. **Validation**: Review outputs before proceeding to next steps