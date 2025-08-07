const express = require('express');
const AtlassianClient = require('../utils/atlassian');

const router = express.Router();

/**
 * Create Jira Issue
 * POST /mcp/jira/create_issue
 */
router.post('/create_issue', async (req, res) => {
  try {
    const client = new AtlassianClient();
    const { project, summary, description, issueType = 'Task', priority, assignee, labels } = req.body;

    if (!project || !summary) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'project and summary are required'
      });
    }

    const issueData = {
      fields: {
        project: { key: project },
        summary: summary,
        description: {
          type: 'doc',
          version: 1,
          content: [{
            type: 'paragraph',
            content: [{
              type: 'text',
              text: description || summary
            }]
          }]
        },
        issuetype: { name: issueType }
      }
    };

    // Add optional fields
    if (priority) issueData.fields.priority = { name: priority };
    if (assignee) issueData.fields.assignee = { accountId: assignee };
    if (labels && Array.isArray(labels)) issueData.fields.labels = labels.map(label => ({ name: label }));

    const result = await client.post(client.getJiraApiPath('/issue'), issueData);
    
    res.json(client.formatSuccess(result, 'Jira issue created successfully'));
  } catch (error) {
    const client = new AtlassianClient();
    res.status(error.response?.status || 500).json(client.handleError(error, 'Create Jira issue'));
  }
});

/**
 * Get Jira Issue
 * GET /mcp/jira/get_issue/:key
 */
router.get('/get_issue/:key', async (req, res) => {
  try {
    const client = new AtlassianClient();
    const { key } = req.params;
    const { expand = 'names,schema,operations,editmeta,changelog,renderedFields' } = req.query;

    const result = await client.get(client.getJiraApiPath(`/issue/${key}`), { expand });
    
    res.json(client.formatSuccess(result, 'Jira issue retrieved successfully'));
  } catch (error) {
    const client = new AtlassianClient();
    res.status(error.response?.status || 500).json(client.handleError(error, 'Get Jira issue'));
  }
});

/**
 * Update Jira Issue
 * PUT /mcp/jira/update_issue/:key
 */
router.put('/update_issue/:key', async (req, res) => {
  try {
    const client = new AtlassianClient();
    const { key } = req.params;
    const { summary, description, priority, assignee, labels } = req.body;

    const updateData = { fields: {} };

    if (summary) updateData.fields.summary = summary;
    if (description) {
      updateData.fields.description = {
        type: 'doc',
        version: 1,
        content: [{
          type: 'paragraph',
          content: [{
            type: 'text',
            text: description
          }]
        }]
      };
    }
    if (priority) updateData.fields.priority = { name: priority };
    if (assignee) updateData.fields.assignee = { accountId: assignee };
    if (labels && Array.isArray(labels)) updateData.fields.labels = labels.map(label => ({ name: label }));

    await client.put(client.getJiraApiPath(`/issue/${key}`), updateData);
    
    res.json(client.formatSuccess({ key }, 'Jira issue updated successfully'));
  } catch (error) {
    const client = new AtlassianClient();
    res.status(error.response?.status || 500).json(client.handleError(error, 'Update Jira issue'));
  }
});

/**
 * Transition Jira Issue
 * POST /mcp/jira/transition_issue/:key
 */
router.post('/transition_issue/:key', async (req, res) => {
  try {
    const client = new AtlassianClient();
    const { key } = req.params;
    const { transition, comment } = req.body;

    if (!transition) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field',
        message: 'transition is required'
      });
    }

    // Get available transitions first
    const transitions = await client.get(client.getJiraApiPath(`/issue/${key}/transitions`));
    const validTransition = transitions.transitions.find(t => 
      t.name.toLowerCase() === transition.toLowerCase() || 
      t.id === transition
    );

    if (!validTransition) {
      return res.status(400).json({
        success: false,
        error: 'Invalid transition',
        message: `Transition '${transition}' is not available for this issue`,
        availableTransitions: transitions.transitions.map(t => ({ id: t.id, name: t.name }))
      });
    }

    const transitionData = {
      transition: { id: validTransition.id }
    };

    if (comment) {
      transitionData.update = {
        comment: [{
          add: {
            body: {
              type: 'doc',
              version: 1,
              content: [{
                type: 'paragraph',
                content: [{
                  type: 'text',
                  text: comment
                }]
              }]
            }
          }
        }]
      };
    }

    await client.post(client.getJiraApiPath(`/issue/${key}/transitions`), transitionData);
    
    res.json(client.formatSuccess({ 
      key, 
      transition: validTransition.name 
    }, 'Jira issue transitioned successfully'));
  } catch (error) {
    const client = new AtlassianClient();
    res.status(error.response?.status || 500).json(client.handleError(error, 'Transition Jira issue'));
  }
});

/**
 * Add Comment to Jira Issue
 * POST /mcp/jira/comment_issue/:key
 */
router.post('/comment_issue/:key', async (req, res) => {
  try {
    const client = new AtlassianClient();
    const { key } = req.params;
    const { comment, visibility } = req.body;

    if (!comment) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field',
        message: 'comment is required'
      });
    }

    const commentData = {
      body: {
        type: 'doc',
        version: 1,
        content: [{
          type: 'paragraph',
          content: [{
            type: 'text',
            text: comment
          }]
        }]
      }
    };

    if (visibility) {
      commentData.visibility = visibility;
    }

    const result = await client.post(client.getJiraApiPath(`/issue/${key}/comment`), commentData);
    
    res.json(client.formatSuccess(result, 'Comment added to Jira issue successfully'));
  } catch (error) {
    const client = new AtlassianClient();
    res.status(error.response?.status || 500).json(client.handleError(error, 'Add comment to Jira issue'));
  }
});

/**
 * Search Jira Issues
 * POST /mcp/jira/search_issues
 */
router.post('/search_issues', async (req, res) => {
  try {
    const client = new AtlassianClient();
    const { 
      jql, 
      startAt = 0, 
      maxResults = 50, 
      fields = ['summary', 'status', 'assignee', 'created', 'updated'],
      expand = ['names', 'schema', 'operations']
    } = req.body;

    if (!jql) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field',
        message: 'jql query is required'
      });
    }

    const searchData = {
      jql,
      startAt,
      maxResults,
      fields,
      expand
    };

    const result = await client.post(client.getJiraApiPath('/search'), searchData);
    
    res.json(client.formatSuccess(result, 'Jira issues searched successfully'));
  } catch (error) {
    const client = new AtlassianClient();
    res.status(error.response?.status || 500).json(client.handleError(error, 'Search Jira issues'));
  }
});

/**
 * List Jira Projects
 * GET /mcp/jira/list_projects
 */
router.get('/list_projects', async (req, res) => {
  try {
    const client = new AtlassianClient();
    const { expand = 'description,lead,issueTypes,url,projectKeys' } = req.query;

    const result = await client.get(client.getJiraApiPath('/project'), { expand });
    
    res.json(client.formatSuccess(result, 'Jira projects retrieved successfully'));
  } catch (error) {
    const client = new AtlassianClient();
    res.status(error.response?.status || 500).json(client.handleError(error, 'List Jira projects'));
  }
});

module.exports = router;