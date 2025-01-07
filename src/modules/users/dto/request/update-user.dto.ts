import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsEnum,
} from 'class-validator';

export class UpdateUserDto {

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  oldPassword?: string; // Dùng để xác thực mật khẩu cũ

  @IsOptional()
  @IsString()
  newPassword?: string; // Mật khẩu mới nếu muốn thay đổi



}
