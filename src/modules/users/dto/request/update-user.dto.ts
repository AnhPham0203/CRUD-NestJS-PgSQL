import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsEnum,
} from 'class-validator';

export class UpdateUserDto {
  // @IsOptional()
  // @IsString()
  // readonly name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly age?: number;


  @IsOptional()
  @IsString()
  readonly username?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['f', 'm', 'u'], { message: 'Gender must be one of f, m, or u.' })
  readonly gender: string;

  
}
