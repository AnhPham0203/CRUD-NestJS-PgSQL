import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, ArrayMinSize } from "class-validator";

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;


  @IsOptional()
  permissionIds: number[] = []; // Accept permissions instead of permissionIds
}