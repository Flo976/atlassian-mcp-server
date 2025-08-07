/**
 * Authentication middleware for MCP API endpoints
 * Validates API key from X-API-Key header
 */

const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const expectedApiKey = process.env.MCP_API_KEY;

  // Check if API key is provided
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required',
      message: 'Please provide X-API-Key header'
    });
  }

  // Check if environment variable is configured
  if (!expectedApiKey) {
    console.error('MCP_API_KEY environment variable not configured');
    return res.status(500).json({
      success: false,
      error: 'Server configuration error',
      message: 'API key validation not properly configured'
    });
  }

  // Validate API key
  if (apiKey !== expectedApiKey) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
  }

  // API key is valid, proceed to next middleware
  next();
};

module.exports = authMiddleware;