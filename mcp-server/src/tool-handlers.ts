import { CallToolRequestSchema, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { RestApiClient } from './rest-client';
import { 
  CreateJiraIssueSchema, GetJiraIssueSchema, UpdateJiraIssueSchema, 
  TransitionJiraIssueSchema, CommentJiraIssueSchema, SearchJiraIssuesSchema,
  ListJiraProjectsSchema
} from './tools/jira-tools';
import {
  CreateConfluencePageSchema, GetConfluencePageSchema, UpdateConfluencePageSchema,
  AddConfluenceCommentSchema, ListConfluenceSpacesSchema, SearchConfluencePagesSchema,
  GetConfluencePageChildrenSchema, DeleteConfluencePageSchema
} from './tools/confluence-tools';

/**
 * Tool handlers that bridge MCP tool calls to REST API calls
 */
export class ToolHandlers {
  private restClient: RestApiClient;

  constructor() {
    this.restClient = new RestApiClient();
  }

  async handleToolCall(request: any): Promise<CallToolResult> {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        // Jira tools
        case 'create_jira_issue':
          return await this.createJiraIssue(args);
        case 'get_jira_issue':
          return await this.getJiraIssue(args);
        case 'update_jira_issue':
          return await this.updateJiraIssue(args);
        case 'transition_jira_issue':
          return await this.transitionJiraIssue(args);
        case 'comment_jira_issue':
          return await this.commentJiraIssue(args);
        case 'search_jira_issues':
          return await this.searchJiraIssues(args);
        case 'list_jira_projects':
          return await this.listJiraProjects(args);

        // Confluence tools
        case 'create_confluence_page':
          return await this.createConfluencePage(args);
        case 'get_confluence_page':
          return await this.getConfluencePage(args);
        case 'update_confluence_page':
          return await this.updateConfluencePage(args);
        case 'add_confluence_comment':
          return await this.addConfluenceComment(args);
        case 'list_confluence_spaces':
          return await this.listConfluenceSpaces(args);
        case 'search_confluence_pages':
          return await this.searchConfluencePages(args);
        case 'get_confluence_page_children':
          return await this.getConfluencePageChildren(args);
        case 'delete_confluence_page':
          return await this.deleteConfluencePage(args);

        default:
          return {
            content: [{
              type: 'text',
              text: `Unknown tool: ${name}`
            }],
            isError: true
          };
      }
    } catch (error: any) {
      console.error(`Error executing tool ${name}:`, error);
      return {
        content: [{
          type: 'text',
          text: `Error executing ${name}: ${error.message}`
        }],
        isError: true
      };
    }
  }

  // Jira tool implementations
  private async createJiraIssue(args: any): Promise<CallToolResult> {
    const validatedArgs = CreateJiraIssueSchema.parse(args);
    const result = await this.restClient.createJiraIssue(validatedArgs);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  }

  private async getJiraIssue(args: any): Promise<CallToolResult> {
    const validatedArgs = GetJiraIssueSchema.parse(args);
    const result = await this.restClient.getJiraIssue(validatedArgs.key);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  }

  private async updateJiraIssue(args: any): Promise<CallToolResult> {
    const validatedArgs = UpdateJiraIssueSchema.parse(args);
    const { key, ...updateData } = validatedArgs;
    const result = await this.restClient.updateJiraIssue(key, updateData);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  }

  private async transitionJiraIssue(args: any): Promise<CallToolResult> {
    const validatedArgs = TransitionJiraIssueSchema.parse(args);
    const { key, ...transitionData } = validatedArgs;
    const result = await this.restClient.transitionJiraIssue(key, transitionData);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  }

  private async commentJiraIssue(args: any): Promise<CallToolResult> {
    const validatedArgs = CommentJiraIssueSchema.parse(args);
    const { key, ...commentData } = validatedArgs;
    const result = await this.restClient.commentJiraIssue(key, commentData);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  }

  private async searchJiraIssues(args: any): Promise<CallToolResult> {
    const validatedArgs = SearchJiraIssuesSchema.parse(args);
    const result = await this.restClient.searchJiraIssues(validatedArgs);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  }

  private async listJiraProjects(args: any): Promise<CallToolResult> {
    const validatedArgs = ListJiraProjectsSchema.parse(args);
    const result = await this.restClient.listJiraProjects();
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  }

  // Confluence tool implementations
  private async createConfluencePage(args: any): Promise<CallToolResult> {
    const validatedArgs = CreateConfluencePageSchema.parse(args);
    const result = await this.restClient.createConfluencePage(validatedArgs);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  }

  private async getConfluencePage(args: any): Promise<CallToolResult> {
    const validatedArgs = GetConfluencePageSchema.parse(args);
    const result = await this.restClient.getConfluencePage(validatedArgs.id);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  }

  private async updateConfluencePage(args: any): Promise<CallToolResult> {
    const validatedArgs = UpdateConfluencePageSchema.parse(args);
    const { id, ...updateData } = validatedArgs;
    const result = await this.restClient.updateConfluencePage(id, updateData);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  }

  private async addConfluenceComment(args: any): Promise<CallToolResult> {
    const validatedArgs = AddConfluenceCommentSchema.parse(args);
    const { id, ...commentData } = validatedArgs;
    const result = await this.restClient.addConfluenceComment(id, commentData);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  }

  private async listConfluenceSpaces(args: any): Promise<CallToolResult> {
    const validatedArgs = ListConfluenceSpacesSchema.parse(args);
    const result = await this.restClient.listConfluenceSpaces();
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  }

  private async searchConfluencePages(args: any): Promise<CallToolResult> {
    const validatedArgs = SearchConfluencePagesSchema.parse(args);
    const result = await this.restClient.searchConfluencePages(validatedArgs);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  }

  private async getConfluencePageChildren(args: any): Promise<CallToolResult> {
    const validatedArgs = GetConfluencePageChildrenSchema.parse(args);
    const { id, ...queryParams } = validatedArgs;
    const result = await this.restClient.get(`/mcp/confluence/get_page_children/${id}`, queryParams);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  }

  private async deleteConfluencePage(args: any): Promise<CallToolResult> {
    const validatedArgs = DeleteConfluencePageSchema.parse(args);
    const result = await this.restClient.delete(`/mcp/confluence/delete_page/${validatedArgs.id}`);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  }
}