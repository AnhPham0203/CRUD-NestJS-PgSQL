import { User } from 'src/modules/users/entities/user.entities';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity('report-user')
export class ReportUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  reason: string;

  @Column({ type: 'enum', enum: ['pending', 'reviewed', 'resolved'], default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.reportedReports, { eager: true })
  reportedUser: User;

  @ManyToOne(() => User, (user) => user.reportsMade, { eager: true })
  reporter: User;
}