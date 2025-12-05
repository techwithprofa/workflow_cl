# Agent Orchestrator MCP Server

An MCP (Model Context Protocol) server that exposes Claude agents as callable tools, enabling the main-agent to orchestrate other specialized agents.

## 🏗️ Architecture

```
┌─────────────┐     MCP Call      ┌─────────────────┐
│  main-agent │ ──────────────►   │ Agent Orchestrator │
│             │                  │    MCP Server    │
└─────────────┘                  └─────────────────┘
         │                                 │
         │          Executes Agent          │
         └─────────────────◄─────────────────┘
                          │
                    ┌──────┴──────┐
                    │   Agent     │
                    │  Executor   │
                    └─────────────┘
```

## 🚀 Features

- **Dynamic Agent Loading**: Automatically loads all agents from `.claude/agents/*.md`
- **MCP Tool Exposure**: Each agent becomes an MCP tool (`call_<agent>_agent`)
- **Context Passing**: Supports passing context between agent calls
- **Error Handling**: Robust error handling and response formatting
- **Scalable**: Easy to add new agents without code changes

## 📦 Installation

### Prerequisites

- Node.js 18+
- Claude Code with MCP support
- TypeScript knowledge (for development)

### Quick Setup

```bash
# Run the setup script
./setup-mcp.sh

# Or manually:
cd agent-orchestrator-mcp
npm install
npm run build
cd ..
```

### Claude Configuration

The MCP server is automatically configured in `.claude/settings.local.json`. Restart Claude Code to load the server.

## 🔧 Usage

### Available Tools

The MCP server exposes the following tools:

- `call_coder_agent(task, context)` - Code implementation
- `call_uiux_agent(task, context)` - UI/UX design
- `call_tester_agent(task, context)` - Testing and QA
- `call_fix_agent(task, context)` - Debugging and fixes
- `call_deployer_agent(task, context)` - Deployment
- `call_documenter_agent(task, context)` - Documentation
- `call_reviewer_agent(task, context)` - Code review
- `call_task_agent(task, context)` - Task planning
- `call_web_search_agent(task, context)` - Web research

### Example Usage

```javascript
// In main-agent:
const result = await call_coder_agent({
  task: "Implement a user authentication system",
  context: {
    requirements: ["JWT tokens", "bcrypt password hashing"],
    endpoints: ["/login", "/register", "/logout"]
  }
});
```

## 🏃‍♂️ Running

### Development Mode

```bash
cd agent-orchestrator-mcp
npm run dev
```

### Production Mode

```bash
cd agent-orchestrator-mcp
npm start
```

## 🧪 Testing

```bash
cd agent-orchestrator-mcp
npm test  # (add tests in the future)
```

## 📁 Project Structure

```
agent-orchestrator-mcp/
├── src/
│   ├── index.ts         # Main MCP server
│   ├── agentLoader.ts   # Loads agent configurations
│   ├── agentExecutor.ts # Executes agents
│   └── types.ts         # TypeScript definitions
├── dist/                # Compiled JavaScript
├── package.json         # Dependencies
├── tsconfig.json       # TypeScript config
└── README.md           # This file
```

## 🔌 Adding New Agents

1. Create a new agent file in `.claude/agents/`
2. Follow the standard agent format with YAML frontmatter
3. Restart Claude Code
4. The agent will be automatically available as an MCP tool

Example agent file:

```markdown
---
name: my-custom-agent
description: Custom agent for specific tasks
tools: Read, Write, Edit, Bash
model: sonnet-4
---

# My Custom Agent

Instructions for the agent...
```

## 🔄 Agent Execution Flow

1. **Load Agents**: Server reads all `.md` files from `.claude/agents/`
2. **Parse Configurations**: Extracts YAML frontmatter and instructions
3. **Create Tools**: Generates MCP tools for each agent
4. **Execute on Call**: When a tool is called, executes the agent with context
5. **Return Results**: Returns formatted responses to the caller

## 🛠️ Configuration

### Environment Variables

- `AGENTS_DIR`: Directory containing agent files (default: `.claude/agents`)
- `LOG_LEVEL`: Logging level (default: `info`)

### Claude Settings

The MCP server is configured in `.claude/settings.local.json`:

```json
{
  "mcpServers": {
    "agent-orchestrator": {
      "command": "node",
      "args": ["./agent-orchestrator-mcp/dist/index.js"],
      "cwd": ".",
      "env": {
        "AGENTS_DIR": ".claude/agents"
      }
    }
  }
}
```

## 🔍 Debugging

### Enable Debug Logging

```bash
DEBUG=agent-orchestrator:* npm start
```

### Common Issues

1. **Agent not found**: Check if the agent file exists and has proper YAML frontmatter
2. **MCP server not loading**: Verify the path in settings.local.json
3. **Tools not available**: Restart Claude Code after configuration changes

## 🚀 Future Enhancements

- [ ] Real Claude API integration (currently simulated)
- [ ] Agent chaining and workflows
- [ ] Persistent agent state
- [ ] Agent metrics and monitoring
- [ ] Parallel agent execution
- [ ] Agent result caching

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review agent configuration files
- Verify Claude MCP settings