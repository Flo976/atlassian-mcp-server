const axios = require('axios');

/**
 * Atlassian API client utility
 * Handles authentication and common API operations
 */

class AtlassianClient {
  constructor() {
    this.baseURL = process.env.ATLASSIAN_BASE_URL;
    this.email = process.env.ATLASSIAN_EMAIL;
    this.apiToken = process.env.ATLASSIAN_API_TOKEN;
    
    if (!this.baseURL || !this.email || !this.apiToken) {
      throw new Error('Missing required Atlassian configuration. Please check ATLASSIAN_BASE_URL, ATLASSIAN_EMAIL, and ATLASSIAN_API_TOKEN environment variables.');
    }

    // Create axios instance with base configuration
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      auth: {
        username: this.email,
        password: this.apiToken
      }
    });

    // Add response interceptor for better error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        console.error('Atlassian API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method
        });
        throw error;
      }
    );
  }

  /**
   * Make GET request to Atlassian API
   */
  async get(endpoint, params = {}) {
    const response = await this.client.get(endpoint, { params });
    return response.data;
  }

  /**
   * Make POST request to Atlassian API
   */
  async post(endpoint, data = {}) {
    const response = await this.client.post(endpoint, data);
    return response.data;
  }

  /**
   * Make PUT request to Atlassian API
   */
  async put(endpoint, data = {}) {
    const response = await this.client.put(endpoint, data);
    return response.data;
  }

  /**
   * Make DELETE request to Atlassian API
   */
  async delete(endpoint) {
    const response = await this.client.delete(endpoint);
    return response.data;
  }

  /**
   * Validate Atlassian connection
   */
  async validateConnection() {
    try {
      // Test connection with a simple API call
      await this.get('/rest/api/3/myself');
      return true;
    } catch (error) {
      console.error('Atlassian connection validation failed:', error.message);
      return false;
    }
  }

  /**
   * Get Jira API base path
   */
  getJiraApiPath(endpoint) {
    return `/rest/api/3${endpoint}`;
  }

  /**
   * Get Confluence API base path
   */
  getConfluenceApiPath(endpoint) {
    return `/wiki/rest/api${endpoint}`;
  }

  /**
   * Handle API errors and format for client response
   */
  handleError(error, operation) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.errorMessages?.[0] || 
                   error.response?.data?.message || 
                   error.message || 
                   'Unknown error occurred';

    return {
      success: false,
      error: `${operation} failed`,
      message: message,
      status: status,
      ...(process.env.NODE_ENV === 'development' && { 
        details: error.response?.data 
      })
    };
  }

  /**
   * Format successful response
   */
  formatSuccess(data, message = 'Operation completed successfully') {
    return {
      success: true,
      message: message,
      data: data
    };
  }
}

module.exports = AtlassianClient;