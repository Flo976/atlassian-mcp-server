const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authMiddleware = require('./middleware/auth');
const jiraRoutes = require('./routes/jira');
const confluenceRoutes = require('./routes/confluence');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Atlassian MCP Server'
  });
});

// API documentation endpoint
app.get('/mcp', (req, res) => {
  res.json({
    service: 'Atlassian MCP Server',
    version: '1.0.0',
    description: 'Bridge between AI agents and Atlassian Cloud APIs',
    endpoints: {
      jira: [
        'POST /mcp/jira/create_issue - Create a Jira ticket',
        'GET /mcp/jira/get_issue/:key - Get Jira ticket by key',
        'PUT /mcp/jira/update_issue/:key - Update Jira ticket',
        'POST /mcp/jira/transition_issue/:key - Transition Jira ticket status',
        'POST /mcp/jira/comment_issue/:key - Add comment to Jira ticket',
        'POST /mcp/jira/search_issues - Search Jira tickets by JQL',
        'GET /mcp/jira/list_projects - List all Jira projects'
      ],
      confluence: [
        'POST /mcp/confluence/create_page - Create Confluence page',
        'GET /mcp/confluence/get_page/:id - Get Confluence page by ID',
        'PUT /mcp/confluence/update_page/:id - Update Confluence page',
        'POST /mcp/confluence/add_comment/:id - Add comment to Confluence page',
        'GET /mcp/confluence/list_spaces - List all Confluence spaces',
        'POST /mcp/confluence/search_pages - Search Confluence pages'
      ]
    }
  });
});

// Authentication middleware for all MCP routes
app.use('/mcp', authMiddleware);

// Routes
app.use('/mcp/jira', jiraRoutes);
app.use('/mcp/confluence', confluenceRoutes);

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.response?.status === 401) {
    return res.status(401).json({
      success: false,
      error: 'Atlassian authentication failed',
      message: 'Please check your Atlassian credentials'
    });
  }
  
  if (error.response?.status === 403) {
    return res.status(403).json({
      success: false,
      error: 'Atlassian access denied',
      message: 'Insufficient permissions for this operation'
    });
  }
  
  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `${req.method} ${req.originalUrl} is not a valid endpoint`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Atlassian MCP Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/mcp`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  
  // Validate required environment variables
  const requiredEnvVars = ['ATLASSIAN_EMAIL', 'ATLASSIAN_API_TOKEN', 'ATLASSIAN_BASE_URL', 'MCP_API_KEY'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Warning: Missing environment variables: ${missingVars.join(', ')}`);
  }
});

module.exports = app;