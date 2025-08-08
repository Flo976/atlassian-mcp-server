import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// Advanced Confluence tools with intelligence and automation
export const advancedConfluenceTools: Tool[] = [
  {
    name: 'sync_jira_confluence',
    description: 'Synchronize Jira issues with Confluence pages for documentation',
    inputSchema: {
      type: 'object',
      properties: {
        issueKey: {
          type: 'string',
          description: 'Jira issue key (e.g., "PROJ-123")'
        },
        space: {
          type: 'string',
          description: 'Confluence space key'
        },
        syncType: {
          type: 'string',
          enum: ['create_page', 'update_existing', 'append_section'],
          description: 'Type of synchronization',
          default: 'create_page'
        },
        template: {
          type: 'string',
          enum: ['requirements', 'tech_spec', 'user_guide', 'release_notes'],
          description: 'Documentation template to use',
          default: 'requirements'
        },
        includeComments: {
          type: 'boolean',
          description: 'Include Jira comments in the page',
          default: true
        },
        autoUpdate: {
          type: 'boolean',
          description: 'Set up automatic updates when Jira issue changes',
          default: false
        },
        parentPageId: {
          type: 'string',
          description: 'Parent page ID for new pages'
        }
      },
      required: ['issueKey', 'space']
    }
  },

  {
    name: 'generate_documentation',
    description: 'Auto-generate documentation from Jira project or sprint data',
    inputSchema: {
      type: 'object',
      properties: {
        source: {
          type: 'string',
          enum: ['project', 'sprint', 'epic', 'release'],
          description: 'Source of data for documentation'
        },
        sourceId: {
          type: 'string',
          description: 'ID of the source (project key, sprint ID, etc.)'
        },
        space: {
          type: 'string',
          description: 'Confluence space key'
        },
        documentType: {
          type: 'string',
          enum: ['release_notes', 'feature_overview', 'api_docs', 'user_guide', 'retrospective'],
          description: 'Type of documentation to generate'
        },
        title: {
          type: 'string',
          description: 'Custom title for the documentation page'
        },
        includeMetrics: {
          type: 'boolean',
          description: 'Include metrics and statistics',
          default: true
        },
        includeDiagrams: {
          type: 'boolean',
          description: 'Generate flowcharts and diagrams',
          default: false
        },
        templateCustomization: {
          type: 'object',
          description: 'Custom template parameters',
          additionalProperties: true
        }
      },
      required: ['source', 'sourceId', 'space', 'documentType']
    }
  },

  {
    name: 'smart_content_suggestions',
    description: 'Get intelligent content suggestions based on page context and similar pages',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: {
          type: 'string',
          description: 'Confluence page ID to analyze'
        },
        suggestionTypes: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['related_pages', 'missing_sections', 'content_improvements', 'template_suggestions', 'link_opportunities']
          },
          description: 'Types of suggestions to generate',
          default: ['related_pages', 'missing_sections']
        },
        contextSize: {
          type: 'number',
          description: 'Number of related pages to analyze for context',
          default: 10,
          maximum: 50
        },
        confidenceThreshold: {
          type: 'number',
          minimum: 0.1,
          maximum: 1.0,
          description: 'Minimum confidence for suggestions',
          default: 0.6
        }
      },
      required: ['pageId']
    }
  },

  {
    name: 'bulk_page_operations',
    description: 'Perform bulk operations on multiple Confluence pages',
    inputSchema: {
      type: 'object',
      properties: {
        space: {
          type: 'string',
          description: 'Confluence space key'
        },
        pageIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific page IDs to operate on'
        },
        cql: {
          type: 'string',
          description: 'CQL query to select pages (alternative to pageIds)'
        },
        operation: {
          type: 'string',
          enum: ['add_label', 'remove_label', 'update_property', 'move_to_space', 'archive', 'set_permissions'],
          description: 'Type of bulk operation'
        },
        operationData: {
          type: 'object',
          description: 'Data specific to the operation type',
          additionalProperties: true
        },
        batchSize: {
          type: 'number',
          description: 'Number of pages to process per batch',
          default: 10,
          maximum: 25
        },
        continueOnError: {
          type: 'boolean',
          description: 'Continue processing if some pages fail',
          default: true
        }
      },
      required: ['operation', 'operationData'],
      anyOf: [
        { required: ['space'] },
        { required: ['pageIds'] },
        { required: ['cql'] }
      ]
    }
  },

  {
    name: 'create_page_hierarchy',
    description: 'Create a structured page hierarchy with templates and cross-links',
    inputSchema: {
      type: 'object',
      properties: {
        space: {
          type: 'string',
          description: 'Confluence space key'
        },
        hierarchyType: {
          type: 'string',
          enum: ['project_docs', 'knowledge_base', 'team_handbook', 'product_specs', 'meeting_notes'],
          description: 'Type of hierarchy to create'
        },
        rootTitle: {
          type: 'string',
          description: 'Title for the root page'
        },
        structure: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              template: { type: 'string' },
              children: {
                type: 'array',
                items: { type: 'string' }
              }
            }
          },
          description: 'Custom hierarchy structure'
        },
        includeNavigation: {
          type: 'boolean',
          description: 'Add navigation macros to pages',
          default: true
        },
        crossLinkPages: {
          type: 'boolean',
          description: 'Create cross-links between related pages',
          default: true
        }
      },
      required: ['space', 'hierarchyType', 'rootTitle']
    }
  },

  {
    name: 'analyze_page_performance',
    description: 'Analyze page performance metrics including views, engagement, and content quality',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: {
          type: 'string',
          description: 'Confluence page ID to analyze'
        },
        space: {
          type: 'string',
          description: 'Analyze all pages in space (alternative to pageId)'
        },
        timeframe: {
          type: 'string',
          enum: ['7days', '30days', '90days'],
          description: 'Analysis timeframe',
          default: '30days'
        },
        metrics: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['views', 'comments', 'likes', 'shares', 'update_frequency', 'content_quality']
          },
          description: 'Metrics to analyze',
          default: ['views', 'comments', 'update_frequency']
        },
        includeRecommendations: {
          type: 'boolean',
          description: 'Include improvement recommendations',
          default: true
        }
      },
      anyOf: [
        { required: ['pageId'] },
        { required: ['space'] }
      ]
    }
  },

  {
    name: 'content_migration_assistant',
    description: 'Assist with migrating content between spaces or from external sources',
    inputSchema: {
      type: 'object',
      properties: {
        sourceType: {
          type: 'string',
          enum: ['confluence_space', 'sharepoint', 'notion', 'google_docs', 'markdown_files'],
          description: 'Source of content to migrate'
        },
        sourceId: {
          type: 'string',
          description: 'Source identifier (space key, URL, etc.)'
        },
        targetSpace: {
          type: 'string',
          description: 'Target Confluence space key'
        },
        migrationRules: {
          type: 'object',
          properties: {
            preserveHierarchy: { type: 'boolean', default: true },
            convertLinks: { type: 'boolean', default: true },
            migrateAttachments: { type: 'boolean', default: true },
            preserveMetadata: { type: 'boolean', default: true }
          },
          description: 'Migration configuration rules'
        },
        contentFilters: {
          type: 'object',
          properties: {
            includeLabels: { type: 'array', items: { type: 'string' } },
            excludeLabels: { type: 'array', items: { type: 'string' } },
            dateRange: {
              type: 'object',
              properties: {
                from: { type: 'string' },
                to: { type: 'string' }
              }
            }
          },
          description: 'Content filtering options'
        },
        dryRun: {
          type: 'boolean',
          description: 'Preview migration without executing',
          default: true
        }
      },
      required: ['sourceType', 'sourceId', 'targetSpace']
    }
  },

  {
    name: 'automated_meeting_notes',
    description: 'Create and maintain automated meeting notes with Jira integration',
    inputSchema: {
      type: 'object',
      properties: {
        meetingType: {
          type: 'string',
          enum: ['standup', 'retrospective', 'planning', 'review', 'general'],
          description: 'Type of meeting'
        },
        space: {
          type: 'string',
          description: 'Confluence space key'
        },
        project: {
          type: 'string',
          description: 'Related Jira project key'
        },
        meetingDate: {
          type: 'string',
          description: 'Meeting date (YYYY-MM-DD)'
        },
        attendees: {
          type: 'array',
          items: { type: 'string' },
          description: 'Attendee account IDs'
        },
        agenda: {
          type: 'array',
          items: { type: 'string' },
          description: 'Meeting agenda items'
        },
        includeJiraUpdates: {
          type: 'boolean',
          description: 'Include recent Jira updates in notes',
          default: true
        },
        createActionItems: {
          type: 'boolean',
          description: 'Automatically create Jira issues for action items',
          default: false
        },
        templateCustomization: {
          type: 'object',
          description: 'Custom template parameters',
          additionalProperties: true
        }
      },
      required: ['meetingType', 'space', 'meetingDate']
    }
  }
];

// Zod schemas for runtime validation
export const SyncJiraConfluenceSchema = z.object({
  issueKey: z.string(),
  space: z.string(),
  syncType: z.enum(['create_page', 'update_existing', 'append_section']).default('create_page'),
  template: z.enum(['requirements', 'tech_spec', 'user_guide', 'release_notes']).default('requirements'),
  includeComments: z.boolean().default(true),
  autoUpdate: z.boolean().default(false),
  parentPageId: z.string().optional()
});

export const GenerateDocumentationSchema = z.object({
  source: z.enum(['project', 'sprint', 'epic', 'release']),
  sourceId: z.string(),
  space: z.string(),
  documentType: z.enum(['release_notes', 'feature_overview', 'api_docs', 'user_guide', 'retrospective']),
  title: z.string().optional(),
  includeMetrics: z.boolean().default(true),
  includeDiagrams: z.boolean().default(false),
  templateCustomization: z.record(z.any()).optional()
});

export const SmartContentSuggestionsSchema = z.object({
  pageId: z.string(),
  suggestionTypes: z.array(z.enum(['related_pages', 'missing_sections', 'content_improvements', 'template_suggestions', 'link_opportunities'])).default(['related_pages', 'missing_sections']),
  contextSize: z.number().max(50).default(10),
  confidenceThreshold: z.number().min(0.1).max(1.0).default(0.6)
});

export const BulkPageOperationsSchema = z.object({
  space: z.string().optional(),
  pageIds: z.array(z.string()).optional(),
  cql: z.string().optional(),
  operation: z.enum(['add_label', 'remove_label', 'update_property', 'move_to_space', 'archive', 'set_permissions']),
  operationData: z.record(z.any()),
  batchSize: z.number().max(25).default(10),
  continueOnError: z.boolean().default(true)
}).refine(data => data.space || data.pageIds || data.cql, {
  message: "Either space, pageIds, or cql must be provided"
});

export const CreatePageHierarchySchema = z.object({
  space: z.string(),
  hierarchyType: z.enum(['project_docs', 'knowledge_base', 'team_handbook', 'product_specs', 'meeting_notes']),
  rootTitle: z.string(),
  structure: z.array(z.object({
    title: z.string(),
    template: z.string().optional(),
    children: z.array(z.string()).optional()
  })).optional(),
  includeNavigation: z.boolean().default(true),
  crossLinkPages: z.boolean().default(true)
});

export const AnalyzePagePerformanceSchema = z.object({
  pageId: z.string().optional(),
  space: z.string().optional(),
  timeframe: z.enum(['7days', '30days', '90days']).default('30days'),
  metrics: z.array(z.enum(['views', 'comments', 'likes', 'shares', 'update_frequency', 'content_quality'])).default(['views', 'comments', 'update_frequency']),
  includeRecommendations: z.boolean().default(true)
}).refine(data => data.pageId || data.space, {
  message: "Either pageId or space must be provided"
});

export const ContentMigrationAssistantSchema = z.object({
  sourceType: z.enum(['confluence_space', 'sharepoint', 'notion', 'google_docs', 'markdown_files']),
  sourceId: z.string(),
  targetSpace: z.string(),
  migrationRules: z.object({
    preserveHierarchy: z.boolean().default(true),
    convertLinks: z.boolean().default(true),
    migrateAttachments: z.boolean().default(true),
    preserveMetadata: z.boolean().default(true)
  }).optional(),
  contentFilters: z.object({
    includeLabels: z.array(z.string()).optional(),
    excludeLabels: z.array(z.string()).optional(),
    dateRange: z.object({
      from: z.string(),
      to: z.string()
    }).optional()
  }).optional(),
  dryRun: z.boolean().default(true)
});

export const AutomatedMeetingNotesSchema = z.object({
  meetingType: z.enum(['standup', 'retrospective', 'planning', 'review', 'general']),
  space: z.string(),
  project: z.string().optional(),
  meetingDate: z.string(),
  attendees: z.array(z.string()).optional(),
  agenda: z.array(z.string()).optional(),
  includeJiraUpdates: z.boolean().default(true),
  createActionItems: z.boolean().default(false),
  templateCustomization: z.record(z.any()).optional()
});