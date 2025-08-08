import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// Advanced Jira tools with intelligence and analytics
export const advancedJiraTools: Tool[] = [
  {
    name: 'analyze_project_health',
    description: 'Analyze project health metrics including velocity, burndown, and risk factors',
    inputSchema: {
      type: 'object',
      properties: {
        project: {
          type: 'string',
          description: 'Jira project key (e.g., "PROJ")'
        },
        timeframe: {
          type: 'string',
          description: 'Analysis timeframe',
          enum: ['7days', '30days', '90days', 'current_sprint', 'last_3_sprints'],
          default: '30days'
        },
        includeVelocity: {
          type: 'boolean',
          description: 'Include velocity analysis',
          default: true
        },
        includeBurndown: {
          type: 'boolean',
          description: 'Include burndown analysis',
          default: true
        },
        includeRiskFactors: {
          type: 'boolean',
          description: 'Identify risk factors and blockers',
          default: true
        }
      },
      required: ['project']
    }
  },

  {
    name: 'predict_issue_resolution',
    description: 'Predict issue resolution time based on historical data and current context',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'Jira issue key (e.g., "PROJ-123")'
        },
        considerAssignee: {
          type: 'boolean',
          description: 'Factor in assignee performance history',
          default: true
        },
        considerPriority: {
          type: 'boolean',
          description: 'Factor in issue priority',
          default: true
        },
        considerComplexity: {
          type: 'boolean',
          description: 'Analyze complexity indicators',
          default: true
        }
      },
      required: ['issueKey']
    }
  },

  {
    name: 'smart_assign_issue',
    description: 'Intelligently assign issue based on workload, expertise, and availability',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'Jira issue key (e.g., "PROJ-123")'
        },
        considerWorkload: {
          type: 'boolean',
          description: 'Consider current assignee workloads',
          default: true
        },
        considerExpertise: {
          type: 'boolean',
          description: 'Consider past performance on similar issues',
          default: true
        },
        teamMembers: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of team member account IDs to consider (optional)'
        },
        forceReassign: {
          type: 'boolean',
          description: 'Force reassignment even if already assigned',
          default: false
        }
      },
      required: ['issueKey']
    }
  },

  {
    name: 'bulk_update_issues',
    description: 'Perform bulk operations on multiple Jira issues with smart batching',
    inputSchema: {
      type: 'object',
      properties: {
        jql: {
          type: 'string',
          description: 'JQL query to select issues for bulk operation'
        },
        issueKeys: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific issue keys (alternative to JQL)'
        },
        operation: {
          type: 'string',
          enum: ['update', 'transition', 'assign', 'add_label', 'remove_label', 'add_component'],
          description: 'Type of bulk operation to perform'
        },
        updateData: {
          type: 'object',
          description: 'Data for the bulk operation (structure depends on operation type)',
          additionalProperties: true
        },
        batchSize: {
          type: 'number',
          description: 'Number of issues to process per batch',
          default: 10,
          maximum: 50
        },
        continueOnError: {
          type: 'boolean',
          description: 'Continue processing if some issues fail',
          default: true
        }
      },
      required: ['operation', 'updateData'],
      anyOf: [
        { required: ['jql'] },
        { required: ['issueKeys'] }
      ]
    }
  },

  {
    name: 'detect_workflow_bottlenecks',
    description: 'Analyze workflow and detect bottlenecks, slow transitions, and improvement opportunities',
    inputSchema: {
      type: 'object',
      properties: {
        project: {
          type: 'string',
          description: 'Jira project key (e.g., "PROJ")'
        },
        timeframe: {
          type: 'string',
          description: 'Analysis timeframe',
          enum: ['7days', '30days', '90days'],
          default: '30days'
        },
        issueTypes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific issue types to analyze (optional)'
        },
        includeRecommendations: {
          type: 'boolean',
          description: 'Include improvement recommendations',
          default: true
        }
      },
      required: ['project']
    }
  },

  {
    name: 'generate_sprint_report',
    description: 'Generate comprehensive sprint report with metrics, achievements, and insights',
    inputSchema: {
      type: 'object',
      properties: {
        boardId: {
          type: 'number',
          description: 'Jira board ID'
        },
        sprintId: {
          type: 'number',
          description: 'Specific sprint ID (optional, defaults to active sprint)'
        },
        includeVelocity: {
          type: 'boolean',
          description: 'Include velocity metrics',
          default: true
        },
        includeBurndown: {
          type: 'boolean',
          description: 'Include burndown chart data',
          default: true
        },
        includeTeamMetrics: {
          type: 'boolean',
          description: 'Include individual team member metrics',
          default: true
        },
        includeRetrospective: {
          type: 'boolean',
          description: 'Include retrospective insights',
          default: true
        },
        format: {
          type: 'string',
          enum: ['json', 'markdown', 'confluence'],
          description: 'Output format',
          default: 'json'
        }
      },
      required: ['boardId']
    }
  },

  {
    name: 'auto_transition_workflow',
    description: 'Automatically transition issues based on conditions and rules',
    inputSchema: {
      type: 'object',
      properties: {
        project: {
          type: 'string',
          description: 'Jira project key (e.g., "PROJ")'
        },
        rules: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              condition: {
                type: 'string',
                description: 'JQL condition for when to apply this rule'
              },
              transition: {
                type: 'string',
                description: 'Transition name or ID to execute'
              },
              comment: {
                type: 'string',
                description: 'Comment to add when transitioning'
              }
            },
            required: ['condition', 'transition']
          },
          description: 'Array of transition rules'
        },
        dryRun: {
          type: 'boolean',
          description: 'Simulate transitions without executing them',
          default: true
        },
        maxIssues: {
          type: 'number',
          description: 'Maximum number of issues to process',
          default: 100
        }
      },
      required: ['project', 'rules']
    }
  },

  {
    name: 'create_issue_template',
    description: 'Create standardized issue templates based on patterns and best practices',
    inputSchema: {
      type: 'object',
      properties: {
        templateType: {
          type: 'string',
          enum: ['bug', 'feature', 'story', 'epic', 'task', 'spike'],
          description: 'Type of template to create'
        },
        project: {
          type: 'string',
          description: 'Jira project key (e.g., "PROJ")'
        },
        templateData: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            acceptanceCriteria: { type: 'string' },
            labels: { type: 'array', items: { type: 'string' } },
            components: { type: 'array', items: { type: 'string' } }
          },
          description: 'Template data structure'
        },
        saveAsTemplate: {
          type: 'boolean',
          description: 'Save this as a reusable template',
          default: false
        },
        createIssue: {
          type: 'boolean',
          description: 'Create the issue immediately',
          default: false
        }
      },
      required: ['templateType', 'project']
    }
  },

  {
    name: 'link_related_issues',
    description: 'Intelligently find and link related issues based on content similarity',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'Source issue key (e.g., "PROJ-123")'
        },
        linkTypes: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['blocks', 'is blocked by', 'relates to', 'duplicates', 'is duplicated by', 'causes', 'is caused by']
          },
          description: 'Types of links to create',
          default: ['relates to']
        },
        similarity: {
          type: 'number',
          minimum: 0.1,
          maximum: 1.0,
          description: 'Minimum similarity threshold (0.1-1.0)',
          default: 0.7
        },
        searchScope: {
          type: 'string',
          enum: ['project', 'all_projects'],
          description: 'Scope of search for related issues',
          default: 'project'
        },
        maxLinks: {
          type: 'number',
          description: 'Maximum number of links to create',
          default: 5,
          maximum: 20
        },
        autoLink: {
          type: 'boolean',
          description: 'Automatically create links (vs. just suggest)',
          default: false
        }
      },
      required: ['issueKey']
    }
  }
];

// Zod schemas for runtime validation
export const AnalyzeProjectHealthSchema = z.object({
  project: z.string(),
  timeframe: z.enum(['7days', '30days', '90days', 'current_sprint', 'last_3_sprints']).default('30days'),
  includeVelocity: z.boolean().default(true),
  includeBurndown: z.boolean().default(true),
  includeRiskFactors: z.boolean().default(true)
});

export const PredictIssueResolutionSchema = z.object({
  issueKey: z.string(),
  considerAssignee: z.boolean().default(true),
  considerPriority: z.boolean().default(true),
  considerComplexity: z.boolean().default(true)
});

export const SmartAssignIssueSchema = z.object({
  issueKey: z.string(),
  considerWorkload: z.boolean().default(true),
  considerExpertise: z.boolean().default(true),
  teamMembers: z.array(z.string()).optional(),
  forceReassign: z.boolean().default(false)
});

export const BulkUpdateIssuesSchema = z.object({
  jql: z.string().optional(),
  issueKeys: z.array(z.string()).optional(),
  operation: z.enum(['update', 'transition', 'assign', 'add_label', 'remove_label', 'add_component']),
  updateData: z.record(z.any()),
  batchSize: z.number().max(50).default(10),
  continueOnError: z.boolean().default(true)
}).refine(data => data.jql || data.issueKeys, {
  message: "Either jql or issueKeys must be provided"
});

export const DetectWorkflowBottlenecksSchema = z.object({
  project: z.string(),
  timeframe: z.enum(['7days', '30days', '90days']).default('30days'),
  issueTypes: z.array(z.string()).optional(),
  includeRecommendations: z.boolean().default(true)
});

export const GenerateSprintReportSchema = z.object({
  boardId: z.number(),
  sprintId: z.number().optional(),
  includeVelocity: z.boolean().default(true),
  includeBurndown: z.boolean().default(true),
  includeTeamMetrics: z.boolean().default(true),
  includeRetrospective: z.boolean().default(true),
  format: z.enum(['json', 'markdown', 'confluence']).default('json')
});

export const AutoTransitionWorkflowSchema = z.object({
  project: z.string(),
  rules: z.array(z.object({
    condition: z.string(),
    transition: z.string(),
    comment: z.string().optional()
  })),
  dryRun: z.boolean().default(true),
  maxIssues: z.number().default(100)
});

export const CreateIssueTemplateSchema = z.object({
  templateType: z.enum(['bug', 'feature', 'story', 'epic', 'task', 'spike']),
  project: z.string(),
  templateData: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    acceptanceCriteria: z.string().optional(),
    labels: z.array(z.string()).optional(),
    components: z.array(z.string()).optional()
  }).optional(),
  saveAsTemplate: z.boolean().default(false),
  createIssue: z.boolean().default(false)
});

export const LinkRelatedIssuesSchema = z.object({
  issueKey: z.string(),
  linkTypes: z.array(z.enum(['blocks', 'is blocked by', 'relates to', 'duplicates', 'is duplicated by', 'causes', 'is caused by'])).default(['relates to']),
  similarity: z.number().min(0.1).max(1.0).default(0.7),
  searchScope: z.enum(['project', 'all_projects']).default('project'),
  maxLinks: z.number().max(20).default(5),
  autoLink: z.boolean().default(false)
});