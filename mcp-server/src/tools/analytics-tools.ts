import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// Analytics and prediction tools
export const analyticsTools: Tool[] = [
  {
    name: 'predict_project_delivery',
    description: 'Predict project delivery dates based on current velocity and remaining work',
    inputSchema: {
      type: 'object',
      properties: {
        project: {
          type: 'string',
          description: 'Jira project key (e.g., "PROJ")'
        },
        version: {
          type: 'string',
          description: 'Target version/release (optional)'
        },
        confidenceLevel: {
          type: 'number',
          minimum: 50,
          maximum: 99,
          description: 'Confidence level for prediction (50-99)',
          default: 80
        },
        includeMilestones: {
          type: 'boolean',
          description: 'Include milestone predictions',
          default: true
        },
        considerRisks: {
          type: 'boolean',
          description: 'Factor in identified risks',
          default: true
        }
      },
      required: ['project']
    }
  },

  {
    name: 'analyze_team_performance',
    description: 'Comprehensive team performance analysis with individual and collective metrics',
    inputSchema: {
      type: 'object',
      properties: {
        project: {
          type: 'string',
          description: 'Jira project key (e.g., "PROJ")'
        },
        timeframe: {
          type: 'string',
          enum: ['current_sprint', 'last_sprint', '30days', '90days', 'current_quarter'],
          description: 'Analysis timeframe',
          default: 'current_sprint'
        },
        teamMembers: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific team member account IDs (optional)'
        },
        metrics: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['velocity', 'quality', 'collaboration', 'workload_distribution', 'burndown_adherence', 'cycle_time']
          },
          description: 'Metrics to include in analysis',
          default: ['velocity', 'quality', 'workload_distribution']
        },
        includeRecommendations: {
          type: 'boolean',
          description: 'Include performance improvement recommendations',
          default: true
        },
        benchmarkComparison: {
          type: 'boolean',
          description: 'Compare against historical benchmarks',
          default: true
        }
      },
      required: ['project']
    }
  },

  {
    name: 'detect_project_risks',
    description: 'AI-powered risk detection and assessment for projects',
    inputSchema: {
      type: 'object',
      properties: {
        project: {
          type: 'string',
          description: 'Jira project key (e.g., "PROJ")'
        },
        riskCategories: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['schedule', 'quality', 'resource', 'technical', 'dependency', 'scope']
          },
          description: 'Categories of risks to analyze',
          default: ['schedule', 'quality', 'dependency']
        },
        severity: {
          type: 'string',
          enum: ['all', 'high', 'medium_high'],
          description: 'Minimum risk severity to include',
          default: 'medium_high'
        },
        includeResolution: {
          type: 'boolean',
          description: 'Include risk resolution strategies',
          default: true
        },
        historicalComparison: {
          type: 'boolean',
          description: 'Compare with similar historical projects',
          default: false
        }
      },
      required: ['project']
    }
  },

  {
    name: 'generate_executive_dashboard',
    description: 'Generate executive-level dashboard with key project and team metrics',
    inputSchema: {
      type: 'object',
      properties: {
        scope: {
          type: 'string',
          enum: ['single_project', 'multiple_projects', 'portfolio', 'organization'],
          description: 'Scope of the dashboard'
        },
        projects: {
          type: 'array',
          items: { type: 'string' },
          description: 'Project keys to include (required for single/multiple projects)'
        },
        timeframe: {
          type: 'string',
          enum: ['current_week', 'current_month', 'current_quarter', 'ytd'],
          description: 'Time period for metrics',
          default: 'current_month'
        },
        sections: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['delivery_status', 'budget_health', 'team_utilization', 'quality_metrics', 'risk_summary', 'milestone_tracking']
          },
          description: 'Dashboard sections to include',
          default: ['delivery_status', 'team_utilization', 'risk_summary']
        },
        format: {
          type: 'string',
          enum: ['json', 'html', 'pdf', 'confluence_page'],
          description: 'Output format for the dashboard',
          default: 'json'
        },
        autoRefresh: {
          type: 'boolean',
          description: 'Set up automatic dashboard refresh',
          default: false
        }
      },
      required: ['scope']
    }
  },

  {
    name: 'forecast_resource_needs',
    description: 'Forecast future resource requirements based on project pipeline and velocity',
    inputSchema: {
      type: 'object',
      properties: {
        projects: {
          type: 'array',
          items: { type: 'string' },
          description: 'Project keys to analyze'
        },
        forecastPeriod: {
          type: 'string',
          enum: ['next_sprint', 'next_month', 'next_quarter', 'next_6_months'],
          description: 'Period to forecast',
          default: 'next_quarter'
        },
        skillCategories: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['frontend', 'backend', 'qa', 'devops', 'design', 'product', 'data']
          },
          description: 'Skill categories to analyze'
        },
        includeContingency: {
          type: 'boolean',
          description: 'Include contingency planning',
          default: true
        },
        confidenceLevel: {
          type: 'number',
          minimum: 50,
          maximum: 95,
          description: 'Confidence level for forecasts',
          default: 75
        }
      },
      required: ['projects']
    }
  },

  {
    name: 'analyze_code_quality_trends',
    description: 'Analyze code quality trends based on bug patterns and technical debt',
    inputSchema: {
      type: 'object',
      properties: {
        project: {
          type: 'string',
          description: 'Jira project key (e.g., "PROJ")'
        },
        timeframe: {
          type: 'string',
          enum: ['30days', '90days', '6months', '1year'],
          description: 'Analysis timeframe',
          default: '90days'
        },
        qualityMetrics: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['bug_density', 'defect_rate', 'technical_debt', 'code_coverage', 'cyclomatic_complexity']
          },
          description: 'Quality metrics to analyze',
          default: ['bug_density', 'defect_rate']
        },
        includeProjections: {
          type: 'boolean',
          description: 'Include future quality projections',
          default: true
        },
        componentAnalysis: {
          type: 'boolean',
          description: 'Analyze quality by component',
          default: false
        }
      },
      required: ['project']
    }
  },

  {
    name: 'calculate_project_roi',
    description: 'Calculate and analyze project ROI including development costs and business value',
    inputSchema: {
      type: 'object',
      properties: {
        project: {
          type: 'string',
          description: 'Jira project key (e.g., "PROJ")'
        },
        costFactors: {
          type: 'object',
          properties: {
            hourlyRate: { type: 'number', description: 'Average hourly rate' },
            overheadMultiplier: { type: 'number', description: 'Overhead multiplier (e.g., 1.5)' },
            toolingCosts: { type: 'number', description: 'Monthly tooling costs' },
            infrastructureCosts: { type: 'number', description: 'Infrastructure costs' }
          },
          description: 'Cost calculation factors'
        },
        valueMetrics: {
          type: 'object',
          properties: {
            revenueImpact: { type: 'number', description: 'Expected revenue impact' },
            costSavings: { type: 'number', description: 'Expected cost savings' },
            userImpact: { type: 'number', description: 'Number of users affected' },
            timeToValue: { type: 'number', description: 'Months to realize value' }
          },
          description: 'Business value metrics'
        },
        timeframe: {
          type: 'string',
          enum: ['actual', '6months', '1year', '2years'],
          description: 'ROI calculation timeframe',
          default: '1year'
        },
        includeProjections: {
          type: 'boolean',
          description: 'Include future ROI projections',
          default: true
        }
      },
      required: ['project']
    }
  }
];

// Zod schemas for runtime validation
export const PredictProjectDeliverySchema = z.object({
  project: z.string(),
  version: z.string().optional(),
  confidenceLevel: z.number().min(50).max(99).default(80),
  includeMilestones: z.boolean().default(true),
  considerRisks: z.boolean().default(true)
});

export const AnalyzeTeamPerformanceSchema = z.object({
  project: z.string(),
  timeframe: z.enum(['current_sprint', 'last_sprint', '30days', '90days', 'current_quarter']).default('current_sprint'),
  teamMembers: z.array(z.string()).optional(),
  metrics: z.array(z.enum(['velocity', 'quality', 'collaboration', 'workload_distribution', 'burndown_adherence', 'cycle_time'])).default(['velocity', 'quality', 'workload_distribution']),
  includeRecommendations: z.boolean().default(true),
  benchmarkComparison: z.boolean().default(true)
});

export const DetectProjectRisksSchema = z.object({
  project: z.string(),
  riskCategories: z.array(z.enum(['schedule', 'quality', 'resource', 'technical', 'dependency', 'scope'])).default(['schedule', 'quality', 'dependency']),
  severity: z.enum(['all', 'high', 'medium_high']).default('medium_high'),
  includeResolution: z.boolean().default(true),
  historicalComparison: z.boolean().default(false)
});

export const GenerateExecutiveDashboardSchema = z.object({
  scope: z.enum(['single_project', 'multiple_projects', 'portfolio', 'organization']),
  projects: z.array(z.string()).optional(),
  timeframe: z.enum(['current_week', 'current_month', 'current_quarter', 'ytd']).default('current_month'),
  sections: z.array(z.enum(['delivery_status', 'budget_health', 'team_utilization', 'quality_metrics', 'risk_summary', 'milestone_tracking'])).default(['delivery_status', 'team_utilization', 'risk_summary']),
  format: z.enum(['json', 'html', 'pdf', 'confluence_page']).default('json'),
  autoRefresh: z.boolean().default(false)
});

export const ForecastResourceNeedsSchema = z.object({
  projects: z.array(z.string()),
  forecastPeriod: z.enum(['next_sprint', 'next_month', 'next_quarter', 'next_6_months']).default('next_quarter'),
  skillCategories: z.array(z.enum(['frontend', 'backend', 'qa', 'devops', 'design', 'product', 'data'])).optional(),
  includeContingency: z.boolean().default(true),
  confidenceLevel: z.number().min(50).max(95).default(75)
});

export const AnalyzeCodeQualityTrendsSchema = z.object({
  project: z.string(),
  timeframe: z.enum(['30days', '90days', '6months', '1year']).default('90days'),
  qualityMetrics: z.array(z.enum(['bug_density', 'defect_rate', 'technical_debt', 'code_coverage', 'cyclomatic_complexity'])).default(['bug_density', 'defect_rate']),
  includeProjections: z.boolean().default(true),
  componentAnalysis: z.boolean().default(false)
});

export const CalculateProjectROISchema = z.object({
  project: z.string(),
  costFactors: z.object({
    hourlyRate: z.number().optional(),
    overheadMultiplier: z.number().optional(),
    toolingCosts: z.number().optional(),
    infrastructureCosts: z.number().optional()
  }).optional(),
  valueMetrics: z.object({
    revenueImpact: z.number().optional(),
    costSavings: z.number().optional(),
    userImpact: z.number().optional(),
    timeToValue: z.number().optional()
  }).optional(),
  timeframe: z.enum(['actual', '6months', '1year', '2years']).default('1year'),
  includeProjections: z.boolean().default(true)
});