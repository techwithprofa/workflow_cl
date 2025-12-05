import { AgentConfig, AgentExecutionContext, MCPToolResponse } from './types.js';
/**
 * Execute an agent with the given context
 * In a real implementation, this would invoke Claude API with the agent's configuration
 */
export declare function executeAgent(agent: AgentConfig, context: AgentExecutionContext): Promise<MCPToolResponse>;
//# sourceMappingURL=agentExecutor.d.ts.map