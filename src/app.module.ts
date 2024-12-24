import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entities';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Địa chỉ máy chủ PostgreSQL
      port: 5432, // Cổng mặc định của PostgreSQL
      username: 'postgres', // Tên người dùng PostgreSQL
      password: 'anhpham0203', // Mật khẩu
      database: 'pgWithNest', // Tên cơ sở dữ liệu
      entities: [User], // Các Entity của bạn
      synchronize: true, // Tự động đồng bộ schema (Chỉ nên dùng ở môi trường dev)
    }),
    UsersModule,
    AuthModule,
    MailModule, // Module xử lý logic liên quan
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
