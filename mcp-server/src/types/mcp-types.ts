import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export interface EnhancedCallToolResult extends CallToolResult {
  metadata?: {
    cached?: boolean;
    executionTime?: number;
    suggestions?: string[];
    relatedActions?: Array<{
      tool: string;
      description: string;
      arguments?: Record<string, any>;
    }>;
  };
}

export interface ToolContext {
  userId?: string;
  sessionId?: string;
  previousTools?: string[];
  preferences?: Record<string, any>;
}

export interface SmartSuggestion {
  type: 'autocomplete' | 'next-action' | 'template' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  data?: Record<string, any>;
}

export interface WorkflowStep {
  tool: string;
  arguments: Record<string, any>;
  condition?: string;
  errorHandling?: 'continue' | 'stop' | 'retry';
}

export interface MCPServerConfig {
  name: string;
  version: string;
  description: string;
  capabilities: {
    tools: boolean;
    resources: boolean;
    prompts: boolean;
    logging: boolean;
  };
  transports: Array<'stdio' | 'sse' | 'http'>;
  features: {
    caching: boolean;
    analytics: boolean;
    contextMemory: boolean;
    smartSuggestions: boolean;
  };
}

export interface PerformanceMetrics {
  toolName: string;
  executionTime: number;
  cacheHit: boolean;
  success: boolean;
  timestamp: number;
  context?: string;
}