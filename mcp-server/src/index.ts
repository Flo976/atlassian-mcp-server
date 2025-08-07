#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { getConfig } from './config';
import { ToolHandlers } from './tool-handlers';
import { jiraTools } from './tools/jira-tools';
import { confluenceTools } from './tools/confluence-tools';

/**
 * Atlassian MCP Server
 * Bridges MCP protocol with existing REST API
 */
class AtlassianMCPServer {
  private server: Server;
  private toolHandlers: ToolHandlers;
  private config = getConfig();

  constructor() {
    this.server = new Server(
      {
        name: 'atlassian-mcp-server',
        version: '1.0.0'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.toolHandlers = new ToolHandlers();
    this.setupHandlers();
  }

  private setupHandlers() {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const allTools = [...jiraTools, ...confluenceTools];
      
      return {
        tools: allTools
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      return await this.toolHandlers.handleToolCall(request);
    });

    // Error handling
    this.server.onerror = (error) => {
      console.error('[MCP Server Error]:', error);
    };

    process.on('SIGINT', async () => {
      console.log('\nShutting down MCP server...');
      await this.server.close();
      process.exit(0);
    });
  }

  async start() {
    console.log('🚀 Starting Atlassian MCP Server...');
    console.log(`📍 REST API Base URL: ${this.config.restApiBaseUrl}`);
    console.log(`🔧 Available Tools: ${jiraTools.length + confluenceTools.length}`);
    console.log(`   - Jira tools: ${jiraTools.length}`);
    console.log(`   - Confluence tools: ${confluenceTools.length}`);
    
    // Use stdio transport for MCP communication
    const transport = new StdioServerTransport();
    
    console.log('✅ MCP Server ready for connections via stdio');
    console.log('💡 Connect with: n8n MCP Client, Claude Desktop, or other MCP clients');
    
    await this.server.connect(transport);
  }
}

// Start the server
async function main() {
  try {
    const server = new AtlassianMCPServer();
    await server.start();
  } catch (error) {
    console.error('❌ Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
}