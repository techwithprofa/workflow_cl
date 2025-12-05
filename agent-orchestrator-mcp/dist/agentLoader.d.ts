import { AgentConfig } from './types.js';
/**
 * Load all agents from the .claude/agents directory
 */
export declare function loadAgents(agentsDir?: string): Promise<AgentConfig[]>;
/**
 * Get a specific agent by name
 */
export declare function getAgentByName(name: string, agentsDir?: string): Promise<AgentConfig | null>;
//# sourceMappingURL=agentLoader.d.ts.map