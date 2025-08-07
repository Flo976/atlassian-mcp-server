import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getConfig } from './config';

/**
 * REST API client for calling the existing Atlassian MCP REST server
 */
export class RestApiClient {
  private client: AxiosInstance;
  private config = getConfig();

  constructor() {
    this.client = axios.create({
      baseURL: this.config.restApiBaseUrl,
      headers: {
        'X-API-Key': this.config.mcpApiKey,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        console.error('REST API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data
        });
        throw error;
      }
    );
  }

  // Generic methods for REST API calls
  async get<T = any>(endpoint: string, params?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(endpoint, { params });
    return response.data;
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(endpoint, data);
    return response.data;
  }

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(endpoint, data);
    return response.data;
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(endpoint);
    return response.data;
  }

  // Jira-specific methods
  async createJiraIssue(data: any) {
    return this.post('/mcp/jira/create_issue', data);
  }

  async getJiraIssue(key: string) {
    return this.get(`/mcp/jira/get_issue/${key}`);
  }

  async updateJiraIssue(key: string, data: any) {
    return this.put(`/mcp/jira/update_issue/${key}`, data);
  }

  async transitionJiraIssue(key: string, data: any) {
    return this.post(`/mcp/jira/transition_issue/${key}`, data);
  }

  async commentJiraIssue(key: string, data: any) {
    return this.post(`/mcp/jira/comment_issue/${key}`, data);
  }

  async searchJiraIssues(data: any) {
    return this.post('/mcp/jira/search_issues', data);
  }

  async listJiraProjects() {
    return this.get('/mcp/jira/list_projects');
  }

  // Confluence-specific methods
  async createConfluencePage(data: any) {
    return this.post('/mcp/confluence/create_page', data);
  }

  async getConfluencePage(id: string) {
    return this.get(`/mcp/confluence/get_page/${id}`);
  }

  async updateConfluencePage(id: string, data: any) {
    return this.put(`/mcp/confluence/update_page/${id}`, data);
  }

  async addConfluenceComment(id: string, data: any) {
    return this.post(`/mcp/confluence/add_comment/${id}`, data);
  }

  async listConfluenceSpaces() {
    return this.get('/mcp/confluence/list_spaces');
  }

  async searchConfluencePages(data: any) {
    return this.post('/mcp/confluence/search_pages', data);
  }
}