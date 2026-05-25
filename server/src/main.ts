import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('Auto Apply API').setVersion('1.0').build(),
  );
  SwaggerModule.setup('api', app, document);

  app.enableCors({ origin: 'http://localhost:3000' });
  await app.listen(process.env.PORT ?? 4200);
}
bootstrap();
