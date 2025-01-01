import { IsNotEmpty, IsOptional, IsString, IsEnum, IsInt } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(['pending', 'in-progress', 'completed'])
  status?: string;

  @IsOptional()
  @IsInt()
  assignedTo?: number;
}