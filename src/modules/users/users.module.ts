import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { User } from './entities/user.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from '../tasks/tasks.module';
import { RolesModule } from '../roles/roles.module';
// import { IsEmailUniqueConstraint } from './custom_validation/IsEmailUniqueConstraint';

@Module({
  imports: [RolesModule, forwardRef(() => TasksModule), TypeOrmModule.forFeature([User]),],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule { }
