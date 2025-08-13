import { Provider } from '@prisma/client';

export interface DatePeriod {
  key: string;
  label: string;
}

export interface DeviceData {
  name: string;
  value: number;
  percentage: number;
}

export interface SourceData {
  name: Provider | string;
  value: number;
  percentage: number;
}

export interface DashboardOptions {
  compareWithPrevious?: boolean;
}

export interface AnalyticsDashboard {
  keyMetrics: {
    totalUsers: {
      value: number;
      growth: number;
      formattedValue: string;
    };
    activeUsers: {
      value: number;
      growth: number;
      formattedValue: string;
    };
    revenue: {
      value: number;
      growth: number;
      formattedValue: string;
    };
    averageSession: {
      value: number;
      growth: number;
      formattedValue: string;
    };
  };
  userActivity: any;
  revenueOverview: any;
  featureUsage: any;
  trafficSources: SourceData[];
  deviceBreakdown: DeviceData[];
  timeRange: number;
  period: {
    start: Date;
    end: Date;
  };
}

export interface UserGrowthAnalytics {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
  totals: {
    newUsers: number;
    activeUsers: number;
  };
}

export interface RevenueAnalytics {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
  totals: {
    revenue: number;
    expenses: number;
    profit: number;
  };
  year: number;
}

export interface FeatureUsageAnalytics {
  labels: string[];
  datasets: {
    data: number[];
  }[];
  totals: {
    analyticsCount: number;
    importCount: number;
    exportCount: number;
    interactionCount: number;
    uploadCount: number;
    leadCount: number;
    totalOperations: number;
  };
  timeRange: number;
}

export interface UserSourceAnalytics {
  sources: SourceData[];
  total: number;
  timeRange: number;
}

export interface DeviceAnalytics {
  devices: DeviceData[];
  total: number;
  timeRange: number;
}

export interface ExportResult {
  fileName: string;
  filePath: string;
  timeRange?: number;
  reportType?: string;
}