import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Глобальная валидация query-параметров и body через class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // автоматически преобразует строки в числа (для @Type)
      whitelist: true, // игнорирует лишние поля, которых нет в DTO
      forbidNonWhitelisted: false,
    }),
  );

  app.enableCors({ origin: 'http://localhost:3000' });
  await app.listen(process.env.PORT ?? 4200);
}
bootstrap();
