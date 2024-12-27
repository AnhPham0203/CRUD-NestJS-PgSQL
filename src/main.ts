import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Kích hoạt CORS
  //  app.enableCors({
  //   origin: 'http://localhost:3000', // Cho phép frontend ReactJS
  //   methods: 'GET,POST,PUT,DELETE,OPTIONS', // Các phương thức HTTP được phép
  //   allowedHeaders: 'Content-Type, Authorization', // Header được phép
  //   credentials: true, // Cho phép gửi cookie
  // });
  app.enableCors()
  // Sử dụng ValidationPipe toàn cục
  // app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // await app.listen(process.env.PORT ?? 8080);
  await app.listen(5000)

}
bootstrap();
