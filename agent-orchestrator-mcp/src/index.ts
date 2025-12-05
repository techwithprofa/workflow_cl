#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import { loadAgents } from './agentLoader.js';
import { executeAgent } from './agentExecutor.js';
import { AgentConfig } from './types.js';

class AgentOrchestratorServer {
  private server: Server;
  private agents: AgentConfig[] = [];

  constructor() {
    this.server = new Server(
      {
        name: 'agent-orchestrator-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools (agents)
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      // Load agents dynamically
      this.agents = await loadAgents();

      // Convert each agent to a tool definition
      const tools: Tool[] = this.agents.map(agent => ({
        name: `call_${agent.name.replace('-agent', '')}_agent`,
        description: `Execute the ${agent.description}`,
        inputSchema: {
          type: 'object',
          properties: {
            task: {
              type: 'string',
              description: 'The task to be executed by the agent'
            },
            context: {
              type: 'object',
              description: 'Additional context for the agent (optional)',
              properties: {},
              additionalProperties: true
            }
          },
          required: ['task']
        }
      }));

      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      // Find the agent for this tool call
      const agentName = name.replace('call_', '').replace('_agent', '') + '-agent';
      const agent = this.agents.find(a => a.name === agentName);

      if (!agent) {
        return {
          content: [
            {
              type: 'text',
              text: `Agent not found: ${agentName}`
            }
          ],
          isError: true
        };
      }

      // Validate arguments
      if (!args || typeof args !== 'object') {
        return {
          content: [
            {
              type: 'text',
              text: 'Invalid arguments provided'
            }
          ],
          isError: true
        };
      }

      // Execute the agent
      const result = await executeAgent(agent, {
        task: args.task as string || '',
        context: args.context,
        ...args
      });

      return result;
    });

    // Handle errors
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Agent Orchestrator MCP server running on stdio');
  }
}

// Start the server
const server = new AgentOrchestratorServer();
server.run().catch(console.error);