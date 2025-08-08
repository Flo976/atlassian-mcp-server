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
  
  // Atlassian Configuration
  atlassianEmail: string;
  atlassianApiToken: string;
  atlassianBaseUrl: string;
  
  // Logging
  logLevel: string;
}

export const getConfig = (): Config => {
  const restApiBaseUrl = process.env.REST_API_BASE_URL || 'http://localhost:3000';
  const mcpApiKey = process.env.MCP_API_KEY;
  
  // Atlassian configuration
  const atlassianEmail = process.env.ATLASSIAN_EMAIL;
  const atlassianApiToken = process.env.ATLASSIAN_API_TOKEN;
  const atlassianBaseUrl = process.env.ATLASSIAN_BASE_URL;
  
  if (!mcpApiKey) {
    throw new Error('MCP_API_KEY environment variable is required');
  }
  
  if (!atlassianEmail || !atlassianApiToken || !atlassianBaseUrl) {
    throw new Error('Atlassian configuration missing: ATLASSIAN_EMAIL, ATLASSIAN_API_TOKEN, and ATLASSIAN_BASE_URL are required');
  }

  return {
    restApiBaseUrl,
    mcpApiKey,
    mcpPort: parseInt(process.env.MCP_PORT || '3001', 10),
    mcpHost: process.env.MCP_HOST || 'localhost',
    atlassianEmail,
    atlassianApiToken,
    atlassianBaseUrl,
    logLevel: process.env.LOG_LEVEL || 'info'
  };
};