import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { User } from './entities/user.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsEmailUniqueConstraint } from './custom_validation/IsEmailUniqueConstraint';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UserService, IsEmailUniqueConstraint]
})
export class UsersModule { }
