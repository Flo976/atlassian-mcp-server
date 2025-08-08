export interface AtlassianConfig {
  email: string;
  apiToken: string;
  baseUrl: string;
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  simplified: boolean;
  style: string;
  isPrivate: boolean;
  properties?: Record<string, any>;
}

export interface JiraIssue {
  id: string;
  key: string;
  self: string;
  fields: {
    summary: string;
    description?: any;
    issuetype: {
      id: string;
      name: string;
      iconUrl: string;
    };
    project: {
      id: string;
      key: string;
      name: string;
    };
    status: {
      id: string;
      name: string;
      categoryId: string;
    };
    priority?: {
      id: string;
      name: string;
      iconUrl: string;
    };
    assignee?: {
      accountId: string;
      displayName: string;
      emailAddress: string;
    };
    reporter: {
      accountId: string;
      displayName: string;
      emailAddress: string;
    };
    created: string;
    updated: string;
    labels: string[];
    components: Array<{
      id: string;
      name: string;
    }>;
    fixVersions: Array<{
      id: string;
      name: string;
    }>;
    resolution?: {
      id: string;
      name: string;
    };
  };
  changelog?: {
    histories: Array<{
      id: string;
      created: string;
      author: {
        accountId: string;
        displayName: string;
      };
      items: Array<{
        field: string;
        fieldtype: string;
        from: string;
        fromString: string;
        to: string;
        toString: string;
      }>;
    }>;
  };
}

export interface JiraTransition {
  id: string;
  name: string;
  to: {
    id: string;
    name: string;
  };
}

export interface ConfluenceSpace {
  id: number;
  key: string;
  name: string;
  type: string;
  status: string;
  _links: {
    webui: string;
    self: string;
  };
  description?: {
    plain: {
      value: string;
    };
  };
}

export interface ConfluencePage {
  id: string;
  type: string;
  status: string;
  title: string;
  space: {
    id: number;
    key: string;
    name: string;
  };
  body?: {
    storage: {
      value: string;
      representation: string;
    };
    view?: {
      value: string;
      representation: string;
    };
  };
  version: {
    number: number;
    when: string;
    by: {
      accountId: string;
      displayName: string;
    };
  };
  ancestors?: Array<{
    id: string;
    title: string;
  }>;
  children?: {
    page?: {
      results: Array<{
        id: string;
        title: string;
      }>;
    };
  };
  _links: {
    webui: string;
    self: string;
  };
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface UserContext {
  userId?: string;
  preferences: {
    defaultProject?: string;
    defaultSpace?: string;
    favoriteProjects: string[];
    favoriteSpaces: string[];
    recentIssues: string[];
    recentPages: string[];
  };
  lastActivity: number;
}

export interface Analytics {
  issueMetrics: {
    totalIssues: number;
    resolvedIssues: number;
    averageResolutionTime: number;
    burndownRate: number;
  };
  projectHealth: {
    score: number;
    blockers: number;
    velocity: number;
    riskFactors: string[];
  };
}