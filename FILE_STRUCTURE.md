# File Structure Documentation (Claude Code Format)

This document provides a comprehensive overview of the file structure for the Claude Multi-Agent Workflow System, now converted to Claude Code format.

## 📁 Project Root Directory Structure

```
workflow_cl/
├── .claude/                     # Claude configuration directory
├── .git/                       # Git version control
├── README.md                   # Project overview documentation
├── README_NEW.md               # New Claude Code format overview
├── FILE_STRUCTURE.md           # This file - structure documentation
├── TREE_VIEW.md                # Visual tree representation
└── convert_*.py                # Migration scripts (can be deleted)
```

## 📂 Detailed File Structure - Claude Code Format

### .claude/ Directory - Claude Configuration System

```
.claude/
├── agents/                     # 10 specialized agents (single markdown files)
│   ├── coder-agent.md         # Code implementation agent
│   ├── deployer-agent.md      # Deployment automation agent
│   ├── documenter-agent.md    # Documentation generation agent
│   ├── fix-agent.md           # Debugging and bug fixing agent
│   ├── main-agent.md          # Main orchestrator agent
│   ├── reviewer-agent.md      # Code review agent
│   ├── task-agent.md          # Task planning and management
│   ├── tester-agent.md        # Testing and QA agent
│   ├── uiux-agent.md          # UI/UX design agent
│   └── web-search-agent.md    # Web research agent
│
├── skills/                    # 18 skill modules (directories with SKILL.md)
│   ├── accessibility/         # Accessibility best practices
│   │   └── SKILL.md
│   ├── appwrite/             # Appwrite backend platform
│   │   └── SKILL.md
│   ├── architecture/         # Software architecture patterns
│   │   └── SKILL.md
│   ├── code-quality/         # Code quality standards
│   │   └── SKILL.md
│   ├── debugging/            # Debugging techniques
│   │   └── SKILL.md
│   ├── deployment/           # Deployment strategies
│   │   └── SKILL.md
│   ├── documentation/        # Documentation practices
│   │   └── SKILL.md
│   ├── e2e-testing/         # End-to-end testing
│   │   └── SKILL.md
│   ├── git-workflow/        # Git workflow management
│   │   └── SKILL.md
│   ├── nextjs/              # Next.js framework
│   │   └── SKILL.md
│   ├── performance/         # Performance optimization
│   │   └── SKILL.md
│   ├── responsive-design/   # Responsive design principles
│   │   └── SKILL.md
│   ├── security/            # Security best practices
│   │   └── SKILL.md
│   ├── shadow-system/       # Shadow system management
│   │   └── SKILL.md
│   ├── testing/             # Testing fundamentals
│   │   └── SKILL.md
│   ├── typescript/          # TypeScript language
│   │   └── SKILL.md
│   ├── vercel/              # Vercel deployment platform
│   │   └── SKILL.md
│   └── web-research/        # Web research methods
│       └── SKILL.md
│
└── settings.local.json      # Local Claude settings
```

## 📋 File Categories and Counts

| Category | Count | Description |
|----------|-------|-------------|
| Agent Files | 10 | Single markdown files with YAML frontmatter |
| Skill Directories | 18 | Each containing SKILL.md file |
| Documentation | 4 | README.md, README_NEW.md, FILE_STRUCTURE.md, TREE_VIEW.md |
| Configuration | 1 | settings.local.json |
| Migration Scripts | 2 | Python conversion scripts (temporary) |
| **Total** | **35** | All configuration and documentation files |

## 🔧 File Purpose and Description

### Agent Files (Claude Code Format)

Each agent is now a single markdown file with YAML frontmatter containing:

1. **YAML Frontmatter**:
   - `name`: Agent identifier
   - `description`: Purpose and capabilities
   - `tools`: Available tools for the agent
   - `model`: AI model to use

2. **Markdown Content**:
   - Agent responsibilities
   - Capabilities and best practices
   - Context configuration (embedded)
   - MCP server information (embedded)

### Agent Specializations

| Agent File | Primary Role | Key Responsibilities |
|------------|--------------|---------------------|
| main-agent.md | Orchestrator | Coordinates all agents, manages complex workflows |
| task-agent.md | Planner | Creates task plans, tracks progress |
| fix-agent.md | Debugger | Identifies and fixes bugs, debugging |
| coder-agent.md | Developer | Implements features, writes code |
| uiux-agent.md | Designer | Creates UI/UX designs, interfaces |
| tester-agent.md | QA Engineer | Writes tests, ensures quality |
| deployer-agent.md | DevOps | Handles deployments, CI/CD |
| documenter-agent.md | Technical Writer | Creates documentation |
| reviewer-agent.md | Code Reviewer | Reviews code for quality |
| web-search-agent.md | Researcher | Performs web research |

### Skill Modules (Claude Code Format)

Each skill is a directory containing `SKILL.md` with:

1. **YAML Frontmatter**:
   - `name`: Skill identifier
   - `description`: When and why to use this skill

2. **Markdown Content**:
   - Expert knowledge domain
   - Best practices
   - Code examples
   - Common patterns

**Skill Categories**:
- **Development**: nextjs, typescript, architecture
- **Quality**: testing, e2e-testing, code-quality, debugging
- **Operations**: deployment, vercel, appwrite, git-workflow
- **Design**: responsive-design, accessibility
- **Security**: security
- **Performance**: performance
- **Research**: web-research, documentation
- **Systems**: shadow-system

### Configuration Files

- **settings.local.json**: Local Claude Code settings and preferences

## 📊 File Size Summary

```
.claude/
├── agents/           ~9KB (30 files)
│   ├── Each agent/   ~300B per file
│   └── registry.json ~1KB
├── skills/           ~45KB (18 files)
│   └── Average       ~2.5KB per skill
└── settings.local.json ~500B
```

## 🔄 System Integration

### File Dependencies

1. **Agent Registry** (registry.json) references all agents
2. **Agent Configurations** reference relevant skills
3. **Skills** may reference other related skills
4. **Settings** configure the entire system behavior

### Configuration Hierarchy

```
settings.local.json (System Level)
    ├── agents/registry.json (Agent Registry)
    ├── agents/[agent]/context.json (Agent Level)
    └── skills/[skill].md (Knowledge Base)
```

## 🚀 Usage Instructions

### Adding a New Agent

1. Create directory: `.claude/[new-agent]/`
2. Add three files:
   - `context.json` - Define agent context
   - `mcp.json` - Configure MCP server
   - `prompt.md` - Write agent instructions
3. Update `agents/registry.json` to include new agent

### Adding a New Skill

1. Create file: `.claude/skills/[new-skill].md`
2. Follow established documentation format
3. Reference from relevant agents if needed

### Modifying Configuration

1. Edit relevant JSON/MD files
2. Test changes with Claude Code
3. Commit changes to Git repository

## 📝 Best Practices

1. **Consistent Naming**: Use kebab-case for all file/directory names
2. **Clear Documentation**: Document each file's purpose
3. **Version Control**: Commit all changes to Git
4. **Backup**: Keep backups of critical configurations
5. **Modular Design**: Keep configurations focused and single-purpose

## 🔍 Troubleshooting

### Common Issues

1. **Missing Files**: Verify all required files exist in agent directories
2. **JSON Syntax**: Validate JSON files for correct syntax
3. **Registry Updates**: Ensure registry.json reflects current agents
4. **Skill References**: Check that agents reference existing skills

### Verification Commands

```bash
# List all agents
ls .claude/agents/

# Verify agent file count
find .claude/agents -name "*.json" -o -name "*.md" | wc -l

# List all skills
ls .claude/skills/

# Verify JSON syntax
python -m json.tool .claude/settings.local.json
```

## 📈 Scalability Considerations

The current structure supports:

- **Adding New Agents**: Simple directory creation with 3 template files
- **Expanding Skills**: Individual MD files for each domain
- **Custom Configurations**: JSON-based flexible configuration
- **Version Control**: Git-friendly text-based configurations

---

This file structure documentation provides a comprehensive overview of the Claude Multi-Agent Workflow System configuration. For more details about specific components, refer to the individual files in their respective directories.