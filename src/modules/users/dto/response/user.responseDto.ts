import { Expose } from 'class-transformer';
import { Role } from 'src/modules/roles/entities/role.entities';
import { Task } from 'src/modules/tasks/entities/task.entities';

export class UserResponseDto {
  @Expose()
  id: number;

  // @Expose()
  // name: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  age: number;

  @Expose()
  gender: string;

  // @Expose()
  // role: Role;

  // @Expose()
  // tasks: Task[];
}
