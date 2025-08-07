const express = require('express');
const AtlassianClient = require('../utils/atlassian');

const router = express.Router();

/**
 * Create Confluence Page
 * POST /mcp/confluence/create_page
 */
router.post('/create_page', async (req, res) => {
  try {
    const client = new AtlassianClient();
    const { space, title, content, parentId, type = 'page' } = req.body;

    if (!space || !title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'space, title, and content are required'
      });
    }

    const pageData = {
      type: type,
      title: title,
      space: { key: space },
      body: {
        storage: {
          value: content,
          representation: 'storage'
        }
      }
    };

    // Add parent page if specified
    if (parentId) {
      pageData.ancestors = [{ id: parentId }];
    }

    const result = await client.post(client.getConfluenceApiPath('/content'), pageData);
    
    res.json(client.formatSuccess(result, 'Confluence page created successfully'));
  } catch (error) {
    const client = new AtlassianClient();
    res.status(error.response?.status || 500).json(client.handleError(error, 'Create Confluence page'));
  }
});

/**
 * Get Confluence Page
 * GET /mcp/confluence/get_page/:id
 */
router.get('/get_page/:id', async (req, res) => {
  try {
    const client = new AtlassianClient();
    const { id } = req.params;
    const { 
      expand = 'body.storage,version,space,history,ancestors,children.page,descendants.page' 
    } = req.query;

    const result = await client.get(client.getConfluenceApiPath(`/content/${id}`), { expand });
    
    res.json(client.formatSuccess(result, 'Confluence page retrieved successfully'));
  } catch (error) {
    const client = new AtlassianClient();
    res.status(error.response?.status || 500).json(client.handleError(error, 'Get Confluence page'));
  }
});

/**
 * Update Confluence Page
 * PUT /mcp/confluence/update_page/:id
 */
router.put('/update_page/:id', async (req, res) => {
  try {
    const client = new AtlassianClient();
    const { id } = req.params;
    const { title, content, version } = req.body;

    if (!version) {
      // Get current version if not provided
      const currentPage = await client.get(client.getConfluenceApiPath(`/content/${id}`), { expand: 'version' });
      version = currentPage.version.number + 1;
    }

    const updateData = {
      id: id,
      type: 'page',
      version: { number: version }
    };

    if (title) updateData.title = title;
    if (content) {
      updateData.body = {
        storage: {
          value: content,
          representation: 'storage'
        }
      };
    }

    const result = await client.put(client.getConfluenceApiPath(`/content/${id}`), updateData);
    
    res.json(client.formatSuccess(result, 'Confluence page updated successfully'));
  } catch (error) {
    const client = new AtlassianClient();
    res.status(error.response?.status || 500).json(client.handleError(error, 'Update Confluence page'));
  }
});

/**
 * Add Comment to Confluence Page
 * POST /mcp/confluence/add_comment/:id
 */
router.post('/add_comment/:id', async (req, res) => {
  try {
    const client = new AtlassianClient();
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field',
        message: 'comment is required'
      });
    }

    const commentData = {
      type: 'comment',
      container: { id: id },
      body: {
        storage: {
          value: comment,
          representation: 'storage'
        }
      }
    };

    const result = await client.post(client.getConfluenceApiPath('/content'), commentData);
    
    res.json(client.formatSuccess(result, 'Comment added to Confluence page successfully'));
  } catch (error) {
    const client = new AtlassianClient();
    res.status(error.response?.status || 500).json(client.handleError(error, 'Add comment to Confluence page'));
  }
});

/**
 * List Confluence Spaces
 * GET /mcp/confluence/list_spaces
 */
router.get('/list_spaces', async (req, res) => {
  try {
    const client = new AtlassianClient();
    const { 
      type = 'global', 
      status = 'current', 
      limit = 25, 
      start = 0,
      expand = 'description,homepage,metadata.labels'
    } = req.query;

    const params = {
      type,
      status,
      limit,
      start,
      expand
    };

    const result = await client.get(client.getConfluenceApiPath('/space'), params);
    
    res.json(client.formatSuccess(result, 'Confluence spaces retrieved successfully'));
  } catch (error) {
    const client = new AtlassianClient();
    res.status(error.response?.status || 500).json(client.handleError(error, 'List Confluence spaces'));
  }
});

/**
 * Search Confluence Pages
 * POST /mcp/confluence/search_pages
 */
router.post('/search_pages', async (req, res) => {
  try {
    const client = new AtlassianClient();
    const { 
      cql, 
      text, 
      title, 
      space, 
      type = 'page',
      limit = 25, 
      start = 0,
      expand = 'body.storage,version,space'
    } = req.body;

    let searchParams = {
      limit,
      start,
      expand
    };

    // Build CQL query if not provided directly
    if (!cql) {
      let cqlParts = [];
      
      if (text) cqlParts.push(`text ~ "${text}"`);
      if (title) cqlParts.push(`title ~ "${title}"`);
      if (space) cqlParts.push(`space = "${space}"`);
      if (type) cqlParts.push(`type = "${type}"`);
      
      if (cqlParts.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Missing search criteria',
          message: 'Either cql or at least one of text/title/space must be provided'
        });
      }
      
      searchParams.cql = cqlParts.join(' and ');
    } else {
      searchParams.cql = cql;
    }

    const result = await client.get(client.getConfluenceApiPath('/content/search'), searchParams);
    
    res.json(client.formatSuccess(result, 'Confluence pages searched successfully'));
  } catch (error) {
    const client = new AtlassianClient();
    res.status(error.response?.status || 500).json(client.handleError(error, 'Search Confluence pages'));
  }
});

/**
 * Get Page Children
 * GET /mcp/confluence/get_page_children/:id
 */
router.get('/get_page_children/:id', async (req, res) => {
  try {
    const client = new AtlassianClient();
    const { id } = req.params;
    const { 
      type = 'page',
      limit = 25, 
      start = 0,
      expand = 'version,space'
    } = req.query;

    const params = {
      limit,
      start,
      expand
    };

    const result = await client.get(client.getConfluenceApiPath(`/content/${id}/child/${type}`), params);
    
    res.json(client.formatSuccess(result, 'Confluence page children retrieved successfully'));
  } catch (error) {
    const client = new AtlassianClient();
    res.status(error.response?.status || 500).json(client.handleError(error, 'Get Confluence page children'));
  }
});

/**
 * Delete Confluence Page
 * DELETE /mcp/confluence/delete_page/:id
 */
router.delete('/delete_page/:id', async (req, res) => {
  try {
    const client = new AtlassianClient();
    const { id } = req.params;

    await client.delete(client.getConfluenceApiPath(`/content/${id}`));
    
    res.json(client.formatSuccess({ id }, 'Confluence page deleted successfully'));
  } catch (error) {
    const client = new AtlassianClient();
    res.status(error.response?.status || 500).json(client.handleError(error, 'Delete Confluence page'));
  }
});

module.exports = router;