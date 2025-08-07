import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// Jira tool definitions with JSON schemas
export const jiraTools: Tool[] = [
  {
    name: 'create_jira_issue',
    description: 'Create a new Jira issue/ticket',
    inputSchema: {
      type: 'object',
      properties: {
        project: {
          type: 'string',
          description: 'Jira project key (e.g., "PROJ")'
        },
        summary: {
          type: 'string',
          description: 'Issue title/summary'
        },
        description: {
          type: 'string',
          description: 'Detailed description of the issue'
        },
        issueType: {
          type: 'string',
          description: 'Type of issue (Task, Bug, Story, etc.)',
          default: 'Task'
        },
        priority: {
          type: 'string',
          description: 'Issue priority (Lowest, Low, Medium, High, Highest)',
          enum: ['Lowest', 'Low', 'Medium', 'High', 'Highest']
        },
        assignee: {
          type: 'string',
          description: 'Assignee account ID'
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of labels to add to the issue'
        }
      },
      required: ['project', 'summary']
    }
  },

  {
    name: 'get_jira_issue',
    description: 'Get details of a Jira issue by its key',
    inputSchema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'Jira issue key (e.g., "PROJ-123")'
        },
        expand: {
          type: 'string',
          description: 'Additional fields to expand in the response',
          default: 'names,schema,operations,editmeta,changelog,renderedFields'
        }
      },
      required: ['key']
    }
  },

  {
    name: 'update_jira_issue',
    description: 'Update an existing Jira issue',
    inputSchema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'Jira issue key (e.g., "PROJ-123")'
        },
        summary: {
          type: 'string',
          description: 'New issue title/summary'
        },
        description: {
          type: 'string',
          description: 'New detailed description'
        },
        priority: {
          type: 'string',
          description: 'New issue priority',
          enum: ['Lowest', 'Low', 'Medium', 'High', 'Highest']
        },
        assignee: {
          type: 'string',
          description: 'New assignee account ID'
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of labels to set on the issue'
        }
      },
      required: ['key']
    }
  },

  {
    name: 'transition_jira_issue',
    description: 'Change the status/workflow state of a Jira issue',
    inputSchema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'Jira issue key (e.g., "PROJ-123")'
        },
        transition: {
          type: 'string',
          description: 'Name or ID of the transition to execute (e.g., "In Progress", "Done")'
        },
        comment: {
          type: 'string',
          description: 'Optional comment to add when transitioning'
        }
      },
      required: ['key', 'transition']
    }
  },

  {
    name: 'comment_jira_issue',
    description: 'Add a comment to a Jira issue',
    inputSchema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'Jira issue key (e.g., "PROJ-123")'
        },
        comment: {
          type: 'string',
          description: 'Comment text to add'
        },
        visibility: {
          type: 'object',
          description: 'Comment visibility settings (optional)',
          properties: {
            type: { type: 'string' },
            value: { type: 'string' }
          }
        }
      },
      required: ['key', 'comment']
    }
  },

  {
    name: 'search_jira_issues',
    description: 'Search for Jira issues using JQL (Jira Query Language)',
    inputSchema: {
      type: 'object',
      properties: {
        jql: {
          type: 'string',
          description: 'JQL query string (e.g., "project = PROJ AND status = \\"To Do\\"")'
        },
        startAt: {
          type: 'number',
          description: 'Starting index for pagination',
          default: 0
        },
        maxResults: {
          type: 'number',
          description: 'Maximum number of results to return',
          default: 50,
          maximum: 100
        },
        fields: {
          type: 'array',
          items: { type: 'string' },
          description: 'Fields to include in the response',
          default: ['summary', 'status', 'assignee', 'created', 'updated']
        },
        expand: {
          type: 'array',
          items: { type: 'string' },
          description: 'Additional data to expand',
          default: ['names', 'schema', 'operations']
        }
      },
      required: ['jql']
    }
  },

  {
    name: 'list_jira_projects',
    description: 'List all Jira projects accessible to the user',
    inputSchema: {
      type: 'object',
      properties: {
        expand: {
          type: 'string',
          description: 'Additional project details to include',
          default: 'description,lead,issueTypes,url,projectKeys'
        }
      }
    }
  }
];

// Zod schemas for runtime validation
export const CreateJiraIssueSchema = z.object({
  project: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  issueType: z.string().default('Task'),
  priority: z.enum(['Lowest', 'Low', 'Medium', 'High', 'Highest']).optional(),
  assignee: z.string().optional(),
  labels: z.array(z.string()).optional()
});

export const GetJiraIssueSchema = z.object({
  key: z.string(),
  expand: z.string().optional()
});

export const UpdateJiraIssueSchema = z.object({
  key: z.string(),
  summary: z.string().optional(),
  description: z.string().optional(),
  priority: z.enum(['Lowest', 'Low', 'Medium', 'High', 'Highest']).optional(),
  assignee: z.string().optional(),
  labels: z.array(z.string()).optional()
});

export const TransitionJiraIssueSchema = z.object({
  key: z.string(),
  transition: z.string(),
  comment: z.string().optional()
});

export const CommentJiraIssueSchema = z.object({
  key: z.string(),
  comment: z.string(),
  visibility: z.object({
    type: z.string(),
    value: z.string()
  }).optional()
});

export const SearchJiraIssuesSchema = z.object({
  jql: z.string(),
  startAt: z.number().default(0),
  maxResults: z.number().max(100).default(50),
  fields: z.array(z.string()).optional(),
  expand: z.array(z.string()).optional()
});

export const ListJiraProjectsSchema = z.object({
  expand: z.string().optional()
});