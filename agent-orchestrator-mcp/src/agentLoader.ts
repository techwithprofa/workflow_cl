import { readFile, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse as parseYAML } from 'yaml';
import { AgentConfig } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Parse YAML frontmatter from markdown content
 */
function parseFrontmatter(content: string): { metadata: any; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content };
  }

  try {
    const metadata = parseYAML(match[1]);
    return { metadata, content: match[2] };
  } catch (error) {
    console.error('Error parsing YAML frontmatter:', error);
    return { metadata: {}, content: match[2] };
  }
}

/**
 * Load and parse an agent file
 */
async function loadAgentFile(filePath: string): Promise<AgentConfig | null> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const { metadata, content: instructions } = parseFrontmatter(content);

    if (!metadata.name) {
      console.warn(`Agent file ${filePath} missing name in frontmatter`);
      return null;
    }

    return {
      name: metadata.name,
      description: metadata.description || `Agent: ${metadata.name}`,
      tools: metadata.tools || '',
      model: metadata.model || 'sonnet-4',
      instructions: instructions.trim()
    };
  } catch (error) {
    console.error(`Error loading agent file ${filePath}:`, error);
    return null;
  }
}

/**
 * Load all agents from the .claude/agents directory
 */
export async function loadAgents(agentsDir: string = '.claude/agents'): Promise<AgentConfig[]> {
  try {
    const files = await readdir(agentsDir);
    const agentFiles = files.filter(file => file.endsWith('.md'));

    const agents: AgentConfig[] = [];

    for (const file of agentFiles) {
      const filePath = join(agentsDir, file);
      const agent = await loadAgentFile(filePath);
      if (agent) {
        agents.push(agent);
      }
    }

    console.log(`Loaded ${agents.length} agents from ${agentsDir}`);
    return agents;
  } catch (error) {
    console.error(`Error loading agents from ${agentsDir}:`, error);
    return [];
  }
}

/**
 * Get a specific agent by name
 */
export async function getAgentByName(name: string, agentsDir: string = '.claude/agents'): Promise<AgentConfig | null> {
  const agents = await loadAgents(agentsDir);
  return agents.find(agent => agent.name === name) || null;
}