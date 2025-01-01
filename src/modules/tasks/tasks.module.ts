import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { UserService } from '../users/users.service';

@Module({
  imports: [forwardRef(() => UsersModule),
          TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService ],
  exports :[TasksService]
})
export class TasksModule {}
