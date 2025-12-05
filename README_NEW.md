# Claude Multi-Agent Workflow System (Claude Code Format)

This repository contains the complete configuration for the Claude Multi-Agent System converted to Claude Code format with 10 specialized agents and 18 skill modules.

## 📂 New Claude Code Structure

```
.claude/
├── agents/                 # 10 specialized agents (single markdown files)
│   ├── main-agent.md       # Orchestrator & coordinator
│   ├── task-agent.md       # Planning & task management
│   ├── fix-agent.md        # Debugging & bug fixes
│   ├── coder-agent.md      # Code implementation
│   ├── uiux-agent.md       # UI/UX design
│   ├── tester-agent.md     # Testing & QA
│   ├── deployer-agent.md   # Deployment & CI/CD
│   ├── documenter-agent.md # Documentation
│   ├── reviewer-agent.md   # Code review
│   └── web-search-agent.md # Web research
│
├── skills/                 # 18 skill modules (directories)
│   ├── nextjs/
│   │   └── SKILL.md        # Next.js framework skill
│   ├── typescript/
│   │   └── SKILL.md        # TypeScript skill
│   ├── accessibility/
│   │   └── SKILL.md        # Accessibility skill
│   ├── appwrite/
│   │   └── SKILL.md        # Appwrite skill
│   ├── architecture/
│   │   └── SKILL.md        # Architecture skill
│   ├── code-quality/
│   │   └── SKILL.md        # Code quality skill
│   ├── debugging/
│   │   └── SKILL.md        # Debugging skill
│   ├── deployment/
│   │   └── SKILL.md        # Deployment skill
│   ├── documentation/
│   │   └── SKILL.md        # Documentation skill
│   ├── e2e-testing/
│   │   └── SKILL.md        # E2E testing skill
│   ├── git-workflow/
│   │   └── SKILL.md        # Git workflow skill
│   ├── performance/
│   │   └── SKILL.md        # Performance skill
│   ├── responsive-design/
│   │   └── SKILL.md        # Responsive design skill
│   ├── security/
│   │   └── SKILL.md        # Security skill
│   ├── shadow-system/
│   │   └── SKILL.md        # Shadow system skill
│   ├── testing/
│   │   └── SKILL.md        # Testing skill
│   ├── vercel/
│   │   └── SKILL.md        # Vercel skill
│   └── web-research/
│       └── SKILL.md        # Web research skill
│
└── settings.local.json     # Local Claude settings
```

## 🔧 Claude Code Format Details

### Agent Format
Each agent is now a single markdown file with YAML frontmatter:

```markdown
---
name: main-agent
description: Primary orchestrator for complex software development tasks
tools: Read, Write, Edit, Bash, Grep, Glob, Task, TodoWrite
model: sonnet-4
---

# Main Agent

[Agent instructions and details...]
```

### Skill Format
Each skill is now a directory containing `SKILL.md` with YAML frontmatter:

```markdown
---
name: nextjs
description: Expert knowledge of Next.js framework for building modern React applications
---

# Next.js Skill

[Skill content and details...]
```

## 📊 File Count

- **Agent Files**: 10 agent markdown files (previously 30 files)
- **Skill Directories**: 18 skill directories with SKILL.md files
- **Configuration**: 1 settings file
- **Total**: 29 configuration files (optimized from 58+)

## 🚀 Key Changes from Previous Format

1. **Simplified Agent Structure**: Each agent is now a single markdown file instead of 3 separate files
2. **Standardized Skill Format**: All skills follow the consistent `SKILL.md` format with YAML frontmatter
3. **YAML Frontmatter**: Both agents and skills include metadata in YAML format
4. **Reduced File Count**: 50% reduction in total configuration files
5. **Better Organization**: Cleaner directory structure following Claude Code conventions

## 🤖 Available Agents

1. **main-agent** - Orchestrates complex tasks
2. **task-agent** - Plans and tracks tasks
3. **fix-agent** - Debugs and fixes bugs
4. **coder-agent** - Implements features
5. **uiux-agent** - Designs interfaces
6. **tester-agent** - Writes tests
7. **deployer-agent** - Handles deployments
8. **documenter-agent** - Creates documentation
9. **reviewer-agent** - Reviews code
10. **web-search-agent** - Researches information

## 💡 Available Skills

- **nextjs** - Next.js framework expertise
- **typescript** - TypeScript language features
- **accessibility** - WCAG and inclusive design
- **appwrite** - Backend-as-a-Service platform
- **architecture** - Software architecture patterns
- **code-quality** - Code standards and linting
- **debugging** - Debugging techniques
- **deployment** - Deployment strategies
- **documentation** - Technical writing
- **e2e-testing** - End-to-end testing
- **git-workflow** - Git version control
- **performance** - Performance optimization
- **responsive-design** - Mobile-first design
- **security** - Security best practices
- **shadow-system** - Shadow DOM and Web Components
- **testing** - Unit and integration testing
- **vercel** - Vercel deployment platform
- **web-research** - Information gathering

## 🛠️ Usage

### View Agent Configuration

```bash
# List all agents
ls .claude/agents/

# View main agent
cat .claude/agents/main-agent.md

# View specific agent
cat .claude/agents/coder-agent.md
```

### View Skills

```bash
# List all skills
ls .claude/skills/

# View specific skill
cat .claude/skills/nextjs/SKILL.md

# View skill with metadata
head -10 .claude/skills/nextjs/SKILL.md
```

## 🔍 Migration Notes

The conversion from the old format included:

1. **Agent Consolidation**: Combined `context.json`, `mcp.json`, and `prompt.md` into single markdown files
2. **Skill Restructuring**: Moved from flat `.md` files to directory-based structure with `SKILL.md`
3. **Metadata Addition**: Added YAML frontmatter to both agents and skills
4. **Content Preservation**: All original content has been preserved and reorganized

## 📝 Configuration

### Adding a New Agent

Create a new file in `.claude/agents/`:

```bash
# Create new agent
cat > .claude/agents/my-agent.md << 'EOF'
---
name: my-agent
description: Description of what this agent does
tools: Read, Write, Edit, Bash
model: sonnet-4
---

# My Agent

Agent instructions here...
EOF
```

### Adding a New Skill

Create a new directory and SKILL.md:

```bash
# Create new skill
mkdir .claude/skills/my-skill
cat > .claude/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: Description of this skill domain
---

# My Skill

Skill content here...
EOF
```

## 🔄 Updates and Maintenance

### Updating Agent Configuration

Edit the agent's markdown file directly:
- YAML frontmatter for metadata
- Markdown content for instructions

### Updating Skills

Edit the `SKILL.md` file in the skill directory:
- YAML frontmatter for metadata
- Markdown content for knowledge domain

---

This new Claude Code format provides a cleaner, more maintainable structure while preserving all functionality and knowledge from the previous system.