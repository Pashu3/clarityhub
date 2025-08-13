export class UploadUsageResponseDto {
    records: {
      id: string;
      userId: string | null;
      ipAddress: string;
      uploadDate: Date;
      fileId: string | null;
      upload: {
        filename: string;
        mimetype: string;
        size: number;
        status: string;
      } | null;
    }[];
    
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }
  
  export class UploadStatsResponseDto {
    userType: string;
    todayUploads: number;
    remaining: number;
  }