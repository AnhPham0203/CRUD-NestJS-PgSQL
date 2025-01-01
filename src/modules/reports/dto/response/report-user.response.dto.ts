import { Expose } from "class-transformer";

export class ReportResponseDto {
    @Expose()
    id: number;
  
    @Expose()
    reportedUser: string; // Có thể là tên hoặc email người bị báo cáo
  
    @Expose()
    reporter: string; // Tên hoặc email người báo cáo
  
    @Expose()
    reason: string;
  
    @Expose()
    status: string;
  
    @Expose()
    createdAt: Date;
  }
  