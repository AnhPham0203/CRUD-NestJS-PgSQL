import { Exclude } from 'class-transformer';
// import { Role } from 'src/auth/enums/role.enum';
import { ReportUser } from 'src/modules/reports/entities/report-user.entities';
import { Role } from 'src/modules/roles/entities/role.entities';
// import { Role } from 'src/modules/roles/entities/role.entities';
import { Task } from 'src/modules/tasks/entities/task.entities';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 40 }) 
  username: string;

  @Column({ type: 'varchar', length: 40 })
  email: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar' })
  // @Exclude()
  password: string;

  @Column({ type: 'enum', enum: ['m', 'f', 'u'] })
 
  gender: string;

  // @Column({ type: 'enum', enum: Role, default: Role.USER })
  // role: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role: Role;

  @OneToMany(() => Task, (task) => task.assignedTo)
  tasks: Task[];

  @OneToMany(() => ReportUser, (report) => report.reporter)
  reportsMade: ReportUser[];

  @OneToMany(() => ReportUser, (report) => report.reportedUser)
  reportedReports: ReportUser[]; 
  

}
