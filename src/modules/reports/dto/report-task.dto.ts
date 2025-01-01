import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';

export class ReportTaskDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(['pending', 'completed', 'in-progress'])
  status?: string;
}
