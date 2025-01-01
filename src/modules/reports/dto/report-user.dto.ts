import { IsNotEmpty, IsString } from "class-validator";

export class CreateReportUserDto {
    @IsNotEmpty()
    reportedUserId: number; // ID của người bị báo cáo
  
    @IsString()
    @IsNotEmpty()
    reason: string; // Lý do báo cáo
  }
  