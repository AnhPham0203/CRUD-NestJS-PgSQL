import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from '../tasks/tasks.module';
import { UsersModule } from '../users/users.module';
import { Task } from '../tasks/entities/task.entities';
import { ReportUser } from './entities/report-user.entities';

@Module({
  imports: [UsersModule,TasksModule,TypeOrmModule.forFeature([Task, ReportUser])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
