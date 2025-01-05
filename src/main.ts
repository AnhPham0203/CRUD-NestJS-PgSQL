import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Kích hoạt CORS
   app.enableCors({
    origin: 'http://localhost:3000', // Cho phép frontend ReactJS
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Các phương thức HTTP được phép
    allowedHeaders: 'Content-Type, Authorization', // Header được phép
    credentials: true, // Cho phép gửi cookie
  });
  // app.enableCors({
  //   origin: 'http://localhost:3000', // Chỉ định origin được phép
  //   credentials: true, // Cho phép gửi cookie và header xác thực
  // });
  // Sử dụng ValidationPipe toàn cục
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(cookieParser());

  // await app.listen(process.env.PORT ?? 8080);
  await app.listen(5000)

}
bootstrap();
