import { Task } from 'src/modules/tasks/entities/task.entities';
import { User } from 'src/modules/users/entities/user.entities';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('report-Task')
export class ReportTask {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // type: string; // task/user

  @Column()
  reason: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, { nullable: true })
  reportedUser: User;

  @ManyToOne(() => Task, { nullable: true })
  reportedTask: Task;
}
