export interface Chart {
    type: string;
    title: string;
    x: string;
    y: string;
  }
  
  export interface KPI {
    title: string;
    value: string | number;
  }
  
  export interface UploadResponse {
    message: string;
    fileId: string;
    filename: string;
    status: string;
    createdAt: Date;
    summary: string;
    kpis: KPI[];
    charts: Chart[];
    stats: any;
    uploadLimits: {
      remaining: number | string;
      userType: string;
      plan: string;
    };
  }