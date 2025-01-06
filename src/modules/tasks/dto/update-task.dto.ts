import { IsOptional, IsString, IsEnum, IsInt, IsDate } from "class-validator";

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    title?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsEnum(['Pending', 'In Progress', 'Completed'])
    status?: string;

    // @IsOptional()
    // @IsDate()
    // updatedAt?: Date;
  
    @IsOptional()
    @IsInt()
    assignedTo?: number;
  }