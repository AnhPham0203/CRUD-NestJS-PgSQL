import { Expose } from 'class-transformer';
import { UserResponseDto } from 'src/modules/users/dto/response/user.responseDto';

export class TaskResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  assignedTo?: UserResponseDto; // Thông tin của User dưới dạng DTO
}
