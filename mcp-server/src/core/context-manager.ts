import { UserContext } from '../types/atlassian-types.js';
import { SmartSuggestion } from '../types/mcp-types.js';
import { ToolContext } from '../types/mcp-types.js';
import { CacheManager } from './cache-manager.js';

export class ContextManager {
  private contexts = new Map<string, UserContext>();
  private cache: CacheManager;
  private toolHistory = new Map<string, string[]>();
  private maxHistoryLength = 50;

  constructor(cache: CacheManager) {
    this.cache = cache;
  }

  async getUserContext(userId: string): Promise<UserContext> {
    // Try to get from memory first
    let context = this.contexts.get(userId);
    
    if (!context) {
      // Try to restore from cache
      context = await this.cache.get<UserContext>(`context:user:${userId}`);
      
      if (!context) {
        // Create new context
        context = {
          preferences: {
            favoriteProjects: [],
            favoriteSpaces: [],
            recentIssues: [],
            recentPages: []
          },
          lastActivity: Date.now()
        };
      }
      
      this.contexts.set(userId, context);
    }
    
    return context;
  }

  async updateUserContext(userId: string, updates: Partial<UserContext>): Promise<void> {
    const context = await this.getUserContext(userId);
    
    // Merge updates
    Object.assign(context, updates);
    context.lastActivity = Date.now();
    
    // Save to memory and cache
    this.contexts.set(userId, context);
    await this.cache.set(`context:user:${userId}`, context, 86400); // 24 hours
  }

  async addToRecentIssues(userId: string, issueKey: string): Promise<void> {
    const context = await this.getUserContext(userId);
    
    // Remove if already exists and add to front
    const recentIssues = context.preferences.recentIssues.filter(key => key !== issueKey);
    recentIssues.unshift(issueKey);
    
    // Keep only last 10
    context.preferences.recentIssues = recentIssues.slice(0, 10);
    
    await this.updateUserContext(userId, { preferences: context.preferences });
  }

  async addToRecentPages(userId: string, pageId: string): Promise<void> {
    const context = await this.getUserContext(userId);
    
    // Remove if already exists and add to front
    const recentPages = context.preferences.recentPages.filter(id => id !== pageId);
    recentPages.unshift(pageId);
    
    // Keep only last 10
    context.preferences.recentPages = recentPages.slice(0, 10);
    
    await this.updateUserContext(userId, { preferences: context.preferences });
  }

  async addFavoriteProject(userId: string, projectKey: string): Promise<void> {
    const context = await this.getUserContext(userId);
    
    if (!context.preferences.favoriteProjects.includes(projectKey)) {
      context.preferences.favoriteProjects.push(projectKey);
      await this.updateUserContext(userId, { preferences: context.preferences });
    }
  }

  async addFavoriteSpace(userId: string, spaceKey: string): Promise<void> {
    const context = await this.getUserContext(userId);
    
    if (!context.preferences.favoriteSpaces.includes(spaceKey)) {
      context.preferences.favoriteSpaces.push(spaceKey);
      await this.updateUserContext(userId, { preferences: context.preferences });
    }
  }

  async setDefaultProject(userId: string, projectKey: string): Promise<void> {
    await this.updateUserContext(userId, {
      preferences: {
        ...(await this.getUserContext(userId)).preferences,
        defaultProject: projectKey
      }
    });
  }

  async setDefaultSpace(userId: string, spaceKey: string): Promise<void> {
    await this.updateUserContext(userId, {
      preferences: {
        ...(await this.getUserContext(userId)).preferences,
        defaultSpace: spaceKey
      }
    });
  }

  // Tool execution history
  async recordToolExecution(userId: string, toolName: string, success: boolean): Promise<void> {
    const sessionId = `${userId}:${new Date().toDateString()}`;
    
    if (!this.toolHistory.has(sessionId)) {
      this.toolHistory.set(sessionId, []);
    }
    
    const history = this.toolHistory.get(sessionId)!;
    const entry = `${toolName}:${success ? 'success' : 'failure'}:${Date.now()}`;
    
    history.push(entry);
    
    // Keep history limited
    if (history.length > this.maxHistoryLength) {
      history.splice(0, history.length - this.maxHistoryLength);
    }
  }

  async getToolHistory(userId: string): Promise<string[]> {
    const sessionId = `${userId}:${new Date().toDateString()}`;
    return this.toolHistory.get(sessionId) || [];
  }

  // Smart suggestions based on context
  async generateSuggestions(userId: string, currentTool?: string): Promise<SmartSuggestion[]> {
    const context = await this.getUserContext(userId);
    const suggestions: SmartSuggestion[] = [];

    // Default project/space suggestions
    if (context.preferences.defaultProject && !currentTool?.includes('project')) {
      suggestions.push({
        type: 'autocomplete',
        title: 'Use Default Project',
        description: `Auto-fill with your default project: ${context.preferences.defaultProject}`,
        confidence: 0.9,
        data: { project: context.preferences.defaultProject }
      });
    }

    if (context.preferences.defaultSpace && currentTool?.includes('confluence')) {
      suggestions.push({
        type: 'autocomplete',
        title: 'Use Default Space',
        description: `Auto-fill with your default space: ${context.preferences.defaultSpace}`,
        confidence: 0.9,
        data: { space: context.preferences.defaultSpace }
      });
    }

    // Recent items suggestions
    if (context.preferences.recentIssues.length > 0 && currentTool?.includes('jira')) {
      suggestions.push({
        type: 'template',
        title: 'Recent Issues',
        description: `Quick access to your recent issues`,
        confidence: 0.8,
        data: { recentIssues: context.preferences.recentIssues.slice(0, 5) }
      });
    }

    if (context.preferences.recentPages.length > 0 && currentTool?.includes('confluence')) {
      suggestions.push({
        type: 'template',
        title: 'Recent Pages',
        description: `Quick access to your recent pages`,
        confidence: 0.8,
        data: { recentPages: context.preferences.recentPages.slice(0, 5) }
      });
    }

    // Next action suggestions based on tool history
    const history = await this.getToolHistory(userId);
    const lastTool = history[history.length - 1]?.split(':')[0];

    if (lastTool === 'create_jira_issue') {
      suggestions.push({
        type: 'next-action',
        title: 'Add Comment',
        description: 'Add a comment to the newly created issue',
        confidence: 0.7,
        data: { tool: 'comment_jira_issue' }
      });

      suggestions.push({
        type: 'next-action',
        title: 'Create Documentation',
        description: 'Create a Confluence page for this issue',
        confidence: 0.6,
        data: { tool: 'create_confluence_page' }
      });
    }

    if (lastTool === 'search_jira_issues') {
      suggestions.push({
        type: 'next-action',
        title: 'Bulk Operations',
        description: 'Perform bulk operations on search results',
        confidence: 0.7,
        data: { tool: 'bulk_update_issues' }
      });
    }

    // Workflow optimization suggestions
    const commonPatterns = this.analyzeToolPatterns(history);
    if (commonPatterns.length > 0) {
      suggestions.push({
        type: 'optimization',
        title: 'Workflow Template',
        description: 'Create a template based on your common workflow pattern',
        confidence: 0.8,
        data: { patterns: commonPatterns }
      });
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  private analyzeToolPatterns(history: string[]): string[] {
    const patterns: Record<string, number> = {};
    const tools = history.map(entry => entry.split(':')[0]);
    
    // Look for common sequences of 2-3 tools
    for (let i = 0; i < tools.length - 1; i++) {
      const pattern = `${tools[i]} → ${tools[i + 1]}`;
      patterns[pattern] = (patterns[pattern] || 0) + 1;
    }
    
    // Return patterns that occur more than once
    return Object.entries(patterns)
      .filter(([_, count]) => count > 1)
      .sort(([_, a], [__, b]) => b - a)
      .map(([pattern, _]) => pattern)
      .slice(0, 3);
  }

  // Auto-completion helpers
  async getAutoCompleteData(userId: string, field: string): Promise<any[]> {
    const context = await this.getUserContext(userId);
    
    switch (field) {
      case 'project':
        return context.preferences.favoriteProjects;
      case 'space':
        return context.preferences.favoriteSpaces;
      case 'issue':
        return context.preferences.recentIssues;
      case 'page':
        return context.preferences.recentPages;
      default:
        return [];
    }
  }

  // Context cleanup
  async cleanupInactiveContexts(maxAgeHours: number = 24): Promise<void> {
    const cutoff = Date.now() - (maxAgeHours * 60 * 60 * 1000);
    const toRemove: string[] = [];
    
    for (const [userId, context] of this.contexts.entries()) {
      if (context.lastActivity < cutoff) {
        toRemove.push(userId);
      }
    }
    
    for (const userId of toRemove) {
      this.contexts.delete(userId);
    }
    
    console.log(`🧹 Cleaned up ${toRemove.length} inactive user contexts`);
  }

  getStats(): {
    activeUsers: number;
    totalContexts: number;
    avgToolsPerUser: number;
  } {
    const activeUsers = this.contexts.size;
    const totalTools = Array.from(this.toolHistory.values()).reduce((sum, history) => sum + history.length, 0);
    
    return {
      activeUsers,
      totalContexts: this.contexts.size,
      avgToolsPerUser: activeUsers > 0 ? totalTools / activeUsers : 0
    };
  }
}