import { IsEnum, IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateReportDto {
  @IsOptional()
  @IsEnum(['pending', 'reviewed', 'resolved'], {
    message: 'Status must be one of: pending, reviewed, resolved',
  })
  status?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsInt()
  resolvedById?: number; // ID của người xử lý report

  @IsOptional()
  resolvedAt?: Date; // Thời gian xử lý
}
