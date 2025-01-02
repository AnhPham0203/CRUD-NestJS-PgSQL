import { Expose, Transform } from "class-transformer";

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

    @Expose()
    @Transform(({ value }) => value?.id, { toPlainOnly: true }) // Chỉ lấy id của reportedUser
    reportedUserId: number;
  
    @Expose()
    @Transform(({ value }) => value?.id, { toPlainOnly: true }) // Chỉ lấy id của reporter
    reporterId: number;
  }
  