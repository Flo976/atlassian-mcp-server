import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { AtlassianConfig, JiraIssue, JiraProject, ConfluencePage, ConfluenceSpace, JiraTransition } from '../types/atlassian-types.js';
import { CacheManager } from './cache-manager.js';

export class AtlassianClient {
  private client: AxiosInstance;
  private cache: CacheManager;
  private config: AtlassianConfig;
  private retryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000
  };

  constructor(config: AtlassianConfig, cache: CacheManager) {
    this.config = config;
    this.cache = cache;
    
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Atlassian-MCP-Server/2.0.0'
      },
      auth: {
        username: config.email,
        password: config.apiToken
      },
      timeout: 30000
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🔄 Atlassian API: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling and caching
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ Atlassian API: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        // Handle rate limiting
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'] || '60';
          console.warn(`⏳ Rate limited, waiting ${retryAfter}s...`);
          await this.delay(parseInt(retryAfter) * 1000);
          return this.client.request(originalRequest!);
        }

        // Handle authentication errors
        if (error.response?.status === 401) {
          throw new Error('Atlassian authentication failed. Please check your credentials.');
        }

        // Handle permission errors
        if (error.response?.status === 403) {
          throw new Error('Insufficient permissions for this Atlassian operation.');
        }

        // Handle not found errors
        if (error.response?.status === 404) {
          throw new Error(`Atlassian resource not found: ${originalRequest?.url}`);
        }

        // Log detailed error information
        console.error('❌ Atlassian API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: originalRequest?.url,
          method: originalRequest?.method
        });

        throw error;
      }
    );
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getCacheKey(endpoint: string, params?: any): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `atlassian:${endpoint}:${paramString}`;
  }

  // Generic API methods with caching
  async get<T>(endpoint: string, params?: any, cacheTtl: number = 300): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);
    
    // Try cache first
    const cached = await this.cache.get<T>(cacheKey);
    if (cached) {
      console.log(`💨 Cache hit: ${endpoint}`);
      return cached;
    }

    const response: AxiosResponse<T> = await this.client.get(endpoint, { params });
    
    // Cache successful responses
    await this.cache.set(cacheKey, response.data, cacheTtl);
    
    return response.data;
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(endpoint, data);
    
    // Invalidate related cache entries
    await this.cache.invalidatePattern(`atlassian:${endpoint.split('/')[0]}:*`);
    
    return response.data;
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(endpoint, data);
    
    // Invalidate related cache entries
    await this.cache.invalidatePattern(`atlassian:${endpoint.split('/')[0]}:*`);
    
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(endpoint);
    
    // Invalidate related cache entries
    await this.cache.invalidatePattern(`atlassian:${endpoint.split('/')[0]}:*`);
    
    return response.data;
  }

  // Jira-specific methods
  async getJiraProjects(): Promise<JiraProject[]> {
    return this.get<JiraProject[]>('/rest/api/3/project', undefined, 600); // Cache for 10 minutes
  }

  async getJiraIssue(issueKey: string, expand?: string): Promise<JiraIssue> {
    const params = expand ? { expand } : undefined;
    return this.get<JiraIssue>(`/rest/api/3/issue/${issueKey}`, params, 60); // Cache for 1 minute
  }

  async createJiraIssue(issueData: any): Promise<JiraIssue> {
    return this.post<JiraIssue>('/rest/api/3/issue', issueData);
  }

  async updateJiraIssue(issueKey: string, updateData: any): Promise<void> {
    await this.put(`/rest/api/3/issue/${issueKey}`, updateData);
  }

  async getJiraTransitions(issueKey: string): Promise<{ transitions: JiraTransition[] }> {
    return this.get(`/rest/api/3/issue/${issueKey}/transitions`, undefined, 300);
  }

  async transitionJiraIssue(issueKey: string, transitionData: any): Promise<void> {
    await this.post(`/rest/api/3/issue/${issueKey}/transitions`, transitionData);
  }

  async addJiraComment(issueKey: string, commentData: any): Promise<any> {
    return this.post(`/rest/api/3/issue/${issueKey}/comment`, commentData);
  }

  async searchJiraIssues(jql: string, fields?: string[], expand?: string[], startAt: number = 0, maxResults: number = 50): Promise<any> {
    const params = {
      jql,
      fields: fields?.join(','),
      expand: expand?.join(','),
      startAt,
      maxResults
    };
    
    return this.get('/rest/api/3/search', params, 30); // Short cache for search results
  }

  // Confluence-specific methods
  async getConfluenceSpaces(type: string = 'global', status: string = 'current', limit: number = 25): Promise<{ results: ConfluenceSpace[] }> {
    const params = { type, status, limit, expand: 'description,homepage,metadata.labels' };
    return this.get('/rest/api/space', params, 600); // Cache for 10 minutes
  }

  async getConfluencePage(pageId: string, expand?: string): Promise<ConfluencePage> {
    const params = expand ? { expand } : undefined;
    return this.get<ConfluencePage>(`/rest/api/content/${pageId}`, params, 60); // Cache for 1 minute
  }

  async createConfluencePage(pageData: any): Promise<ConfluencePage> {
    return this.post<ConfluencePage>('/rest/api/content', pageData);
  }

  async updateConfluencePage(pageId: string, updateData: any): Promise<ConfluencePage> {
    return this.put<ConfluencePage>(`/rest/api/content/${pageId}`, updateData);
  }

  async deleteConfluencePage(pageId: string): Promise<void> {
    await this.delete(`/rest/api/content/${pageId}`);
  }

  async searchConfluencePages(cql?: string, limit: number = 25, start: number = 0, expand?: string): Promise<any> {
    const params = { cql, limit, start, expand };
    return this.get('/rest/api/content/search', params, 30); // Short cache for search results
  }

  async addConfluenceComment(pageId: string, commentData: any): Promise<any> {
    const data = {
      type: 'comment',
      container: { id: pageId },
      body: commentData.body
    };
    return this.post('/rest/api/content', data);
  }

  async getConfluencePageChildren(pageId: string, type: string = 'page', limit: number = 25): Promise<any> {
    const params = { limit, expand: 'version,space' };
    return this.get(`/rest/api/content/${pageId}/child/${type}`, params, 300);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      await this.get('/rest/api/3/myself', undefined, 0); // No cache for health check
      return {
        status: 'healthy',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Analytics helpers
  async getProjectVelocity(projectKey: string, sprintCount: number = 5): Promise<any> {
    const jql = `project = "${projectKey}" AND sprint in closedSprints() ORDER BY created DESC`;
    return this.searchJiraIssues(jql, ['summary', 'status', 'created', 'resolutiondate'], ['changelog'], 0, sprintCount * 50);
  }

  async getIssueMetrics(projectKey: string, days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const jql = `project = "${projectKey}" AND created >= "${startDate.toISOString().split('T')[0]}"`;
    
    return this.searchJiraIssues(jql, ['summary', 'status', 'priority', 'assignee', 'created', 'resolutiondate'], ['changelog']);
  }
}