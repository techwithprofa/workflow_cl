#!/bin/bash

# Setup script for Agent Orchestrator MCP Server

echo "🚀 Setting up Agent Orchestrator MCP Server..."

# Navigate to the agent-orchestrator-mcp directory
cd agent-orchestrator-mcp

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the TypeScript code
echo "🔨 Building TypeScript code..."
npm run build

# Navigate back to project root
cd ..

# Update Claude settings to include MCP server
echo "⚙️ Updating Claude settings..."

# Create or update the settings file to include MCP
if [ -f .claude/settings.local.json ]; then
    # Backup existing settings
    cp .claude/settings.local.json .claude/settings.local.json.backup
fi

# Merge MCP settings with existing settings
node -e "
const fs = require('fs');
let settings = {};
try {
  settings = JSON.parse(fs.readFileSync('.claude/settings.local.json', 'utf8'));
} catch (e) {
  // File doesn't exist or is invalid
}

const mcpSettings = JSON.parse(fs.readFileSync('.claude/settings.mcp.json', 'utf8'));
settings.mcpServers = { ...settings.mcpServers, ...mcpSettings.mcpServers };

fs.writeFileSync('.claude/settings.local.json', JSON.stringify(settings, null, 2));
console.log('✅ Settings updated successfully');
"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Restart Claude Code to load the MCP server"
echo "2. The main-agent will now have access to call_*_agent tools"
echo "3. Use main-agent-mcp.md for the enhanced main agent with MCP integration"
echo ""
echo "🔧 To test the MCP server:"
echo "   cd agent-orchestrator-mcp && npm test"
echo ""
echo "📖 For more information, see agent-orchestrator-mcp/README.md"