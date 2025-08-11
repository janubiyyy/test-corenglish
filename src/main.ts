import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS for development
  app.enableCors();

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('A RESTful API for managing tasks')
    .setVersion('1.0')
    .addTag('tasks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Get port and host from environment variables
  const port = configService.get<number>('PORT', 3000);
  const host = configService.get<string>('HOST', 'localhost');

  await app.listen(port, host);
  
  console.log(`Application is running on: http://${host}:${port}`);
  console.log(`Swagger documentation is available at: http://${host}:${port}/api`);
}

bootstrap();
