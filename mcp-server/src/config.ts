import { config } from 'dotenv';

// Load environment variables
config();

export interface Config {
  // REST API Configuration
  restApiBaseUrl: string;
  mcpApiKey: string;
  
  // MCP Server Configuration
  mcpPort: number;
  mcpHost: string;
  
  // Logging
  logLevel: string;
}

export const getConfig = (): Config => {
  const restApiBaseUrl = process.env.REST_API_BASE_URL || 'http://localhost:3000';
  const mcpApiKey = process.env.MCP_API_KEY;
  
  if (!mcpApiKey) {
    throw new Error('MCP_API_KEY environment variable is required');
  }

  return {
    restApiBaseUrl,
    mcpApiKey,
    mcpPort: parseInt(process.env.MCP_PORT || '3001', 10),
    mcpHost: process.env.MCP_HOST || 'localhost',
    logLevel: process.env.LOG_LEVEL || 'info'
  };
};