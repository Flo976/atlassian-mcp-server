import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// Confluence tool definitions with JSON schemas
export const confluenceTools: Tool[] = [
  {
    name: 'create_confluence_page',
    description: 'Create a new Confluence page',
    inputSchema: {
      type: 'object',
      properties: {
        space: {
          type: 'string',
          description: 'Confluence space key (e.g., "SPACE")'
        },
        title: {
          type: 'string',
          description: 'Page title'
        },
        content: {
          type: 'string',
          description: 'Page content in HTML format'
        },
        parentId: {
          type: 'string',
          description: 'ID of parent page (optional, creates top-level page if not provided)'
        },
        type: {
          type: 'string',
          description: 'Page type',
          default: 'page',
          enum: ['page', 'blogpost']
        }
      },
      required: ['space', 'title', 'content']
    }
  },

  {
    name: 'get_confluence_page',
    description: 'Get details of a Confluence page by its ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Confluence page ID'
        },
        expand: {
          type: 'string',
          description: 'Additional fields to expand in the response',
          default: 'body.storage,version,space,history,ancestors,children.page,descendants.page'
        }
      },
      required: ['id']
    }
  },

  {
    name: 'update_confluence_page',
    description: 'Update an existing Confluence page',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Confluence page ID'
        },
        title: {
          type: 'string',
          description: 'New page title'
        },
        content: {
          type: 'string',
          description: 'New page content in HTML format'
        },
        version: {
          type: 'number',
          description: 'Version number for the update (will be auto-incremented if not provided)'
        }
      },
      required: ['id']
    }
  },

  {
    name: 'add_confluence_comment',
    description: 'Add a comment to a Confluence page',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Confluence page ID'
        },
        comment: {
          type: 'string',
          description: 'Comment content in HTML format'
        }
      },
      required: ['id', 'comment']
    }
  },

  {
    name: 'list_confluence_spaces',
    description: 'List all Confluence spaces accessible to the user',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description: 'Type of spaces to list',
          default: 'global',
          enum: ['global', 'personal']
        },
        status: {
          type: 'string',
          description: 'Status of spaces to list',
          default: 'current',
          enum: ['current', 'archived']
        },
        limit: {
          type: 'number',
          description: 'Maximum number of spaces to return',
          default: 25,
          maximum: 200
        },
        start: {
          type: 'number',
          description: 'Starting index for pagination',
          default: 0
        },
        expand: {
          type: 'string',
          description: 'Additional space details to include',
          default: 'description,homepage,metadata.labels'
        }
      }
    }
  },

  {
    name: 'search_confluence_pages',
    description: 'Search for Confluence pages using CQL (Confluence Query Language)',
    inputSchema: {
      type: 'object',
      properties: {
        cql: {
          type: 'string',
          description: 'CQL query string (e.g., "space = SPACE and type = page")'
        },
        text: {
          type: 'string',
          description: 'Text to search for in page content (alternative to CQL)'
        },
        title: {
          type: 'string',
          description: 'Text to search for in page titles (alternative to CQL)'
        },
        space: {
          type: 'string',
          description: 'Space key to search within (alternative to CQL)'
        },
        type: {
          type: 'string',
          description: 'Content type to search for',
          default: 'page',
          enum: ['page', 'blogpost', 'comment', 'attachment']
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return',
          default: 25,
          maximum: 200
        },
        start: {
          type: 'number',
          description: 'Starting index for pagination',
          default: 0
        },
        expand: {
          type: 'string',
          description: 'Additional data to expand in results',
          default: 'body.storage,version,space'
        }
      }
    }
  },

  {
    name: 'get_confluence_page_children',
    description: 'Get child pages of a Confluence page',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Parent page ID'
        },
        type: {
          type: 'string',
          description: 'Type of children to retrieve',
          default: 'page',
          enum: ['page', 'comment', 'attachment']
        },
        limit: {
          type: 'number',
          description: 'Maximum number of children to return',
          default: 25,
          maximum: 200
        },
        start: {
          type: 'number',
          description: 'Starting index for pagination',
          default: 0
        },
        expand: {
          type: 'string',
          description: 'Additional data to expand',
          default: 'version,space'
        }
      },
      required: ['id']
    }
  },

  {
    name: 'delete_confluence_page',
    description: 'Delete a Confluence page',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Confluence page ID to delete'
        }
      },
      required: ['id']
    }
  }
];

// Zod schemas for runtime validation
export const CreateConfluencePageSchema = z.object({
  space: z.string(),
  title: z.string(),
  content: z.string(),
  parentId: z.string().optional(),
  type: z.enum(['page', 'blogpost']).default('page')
});

export const GetConfluencePageSchema = z.object({
  id: z.string(),
  expand: z.string().optional()
});

export const UpdateConfluencePageSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  version: z.number().optional()
});

export const AddConfluenceCommentSchema = z.object({
  id: z.string(),
  comment: z.string()
});

export const ListConfluenceSpacesSchema = z.object({
  type: z.enum(['global', 'personal']).default('global'),
  status: z.enum(['current', 'archived']).default('current'),
  limit: z.number().max(200).default(25),
  start: z.number().default(0),
  expand: z.string().optional()
});

export const SearchConfluencePagesSchema = z.object({
  cql: z.string().optional(),
  text: z.string().optional(),
  title: z.string().optional(),
  space: z.string().optional(),
  type: z.enum(['page', 'blogpost', 'comment', 'attachment']).default('page'),
  limit: z.number().max(200).default(25),
  start: z.number().default(0),
  expand: z.string().optional()
});

export const GetConfluencePageChildrenSchema = z.object({
  id: z.string(),
  type: z.enum(['page', 'comment', 'attachment']).default('page'),
  limit: z.number().max(200).default(25),
  start: z.number().default(0),
  expand: z.string().optional()
});

export const DeleteConfluencePageSchema = z.object({
  id: z.string()
});