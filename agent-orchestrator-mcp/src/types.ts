export interface AgentConfig {
  name: string;
  description: string;
  tools: string;
  model: string;
  instructions: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, any>;
    required: string[];
  };
}

export interface AgentExecutionContext {
  task: string;
  context?: any;
  [key: string]: any;
}

export interface MCPToolResponse {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
  _meta?: {
    "io.modelcontextprotocol/related-task"?: {
      taskId: string;
    };
  };
}