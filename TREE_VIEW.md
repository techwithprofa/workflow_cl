# Project Tree View

A visual representation of the Claude Multi-Agent Workflow System file structure.

## 🌳 Complete File Tree

```
workflow_cl/
│
├── 📂 .claude/                    # Claude Configuration System
│   ├── 📂 agents/                 # 10 Specialized Agents
│   │   ├── 📂 coder-agent/       # 🔧 Code Implementation
│   │   │   ├── 📄 context.json   # Agent context settings
│   │   │   ├── 📄 mcp.json      # MCP server config
│   │   │   └── 📄 prompt.md     # Agent instructions
│   │   │
│   │   ├── 📂 deployer-agent/    # 🚀 Deployment Automation
│   │   │   ├── 📄 context.json
│   │   │   ├── 📄 mcp.json
│   │   │   └── 📄 prompt.md
│   │   │
│   │   ├── 📂 documenter-agent/  # 📝 Documentation
│   │   │   ├── 📄 context.json
│   │   │   ├── 📄 mcp.json
│   │   │   └── 📄 prompt.md
│   │   │
│   │   ├── 📂 fix-agent/         # 🐛 Debug & Bug Fixes
│   │   │   ├── 📄 context.json
│   │   │   ├── 📄 mcp.json
│   │   │   └── 📄 prompt.md
│   │   │
│   │   ├── 📂 main-agent/        # 🎯 Main Orchestrator
│   │   │   ├── 📄 context.json
│   │   │   ├── 📄 mcp.json
│   │   │   └── 📄 prompt.md
│   │   │
│   │   ├── 📂 reviewer-agent/    # 👀 Code Review
│   │   │   ├── 📄 context.json
│   │   │   ├── 📄 mcp.json
│   │   │   └── 📄 prompt.md
│   │   │
│   │   ├── 📂 task-agent/        # 📋 Task Planning
│   │   │   ├── 📄 context.json
│   │   │   ├── 📄 mcp.json
│   │   │   └── 📄 prompt.md
│   │   │
│   │   ├── 📂 tester-agent/      # 🧪 Testing & QA
│   │   │   ├── 📄 context.json
│   │   │   ├── 📄 mcp.json
│   │   │   └── 📄 prompt.md
│   │   │
│   │   ├── 📂 uiux-agent/        # 🎨 UI/UX Design
│   │   │   ├── 📄 context.json
│   │   │   ├── 📄 mcp.json
│   │   │   └── 📄 prompt.md
│   │   │
│   │   ├── 📂 web-search-agent/  # 🔍 Web Research
│   │   │   ├── 📄 context.json
│   │   │   ├── 📄 mcp.json
│   │   │   └── 📄 prompt.md
│   │   │
│   │   └── 📄 registry.json      # 📋 Agent Registry
│   │
│   ├── 📂 skills/                 # 18 Skill Modules
│   │   ├── 📄 accessibility.md      # ♿ Accessibility
│   │   ├── 📄 appwrite.md          # 🔧 Appwrite Platform
│   │   ├── 📄 architecture.md      # 🏗️ Architecture
│   │   ├── 📄 code-quality.md      # ✨ Code Quality
│   │   ├── 📄 debugging.md         # 🐛 Debugging
│   │   ├── 📄 deployment.md        # 🚀 Deployment
│   │   ├── 📄 documentation.md     # 📚 Documentation
│   │   ├── 📄 e2e-testing.md       # 🔄 E2E Testing
│   │   ├── 📄 git-workflow.md      # 📦 Git Workflow
│   │   ├── 📄 nextjs.md            # ⚛️ Next.js
│   │   ├── 📄 performance.md       # ⚡ Performance
│   │   ├── 📄 responsive-design.md  # 📱 Responsive Design
│   │   ├── 📄 security.md          # 🔒 Security
│   │   ├── 📄 shadow-system.md     # 👥 Shadow System
│   │   ├── 📄 testing.md           # 🧪 Testing
│   │   ├── 📄 typescript.md        # 📘 TypeScript
│   │   ├── 📄 vercel.md            # 🌐 Vercel
│   │   └── 📄 web-research.md      # 🔍 Web Research
│   │
│   └── 📄 settings.local.json      # ⚙️ Local Settings
│
├── 📂 .git/                       # Git Version Control
│   ├── ... (Git internal files)
│
├── 📄 README.md                   # 📖 Project Overview
└── 📄 FILE_STRUCTURE.md          # 📋 Structure Documentation
```

## 📊 Quick Stats

```
Total Files: 51+
├── Agent Files: 30 (10 × 3 files each)
├── Skill Files: 18
├── Documentation: 2
└── Configuration: 1
```

## 🎯 Key Locations

- **🤖 Agents**: `.claude/agents/`
- **💡 Skills**: `.claude/skills/`
- **⚙️ Settings**: `.claude/settings.local.json`
- **📖 Docs**: `README.md`, `FILE_STRUCTURE.md`

## 🔍 Navigation Tips

1. **Agent Configuration**: Each agent has its own folder with 3 files
2. **Skills**: All skill modules are in the `/skills` directory
3. **Registry**: Check `agents/registry.json` for agent metadata
4. **Settings**: Main configuration in `settings.local.json`

---

This tree view provides a quick visual reference for navigating the Claude Multi-Agent Workflow System structure.