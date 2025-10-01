import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );


const corsOrigins = (configService.get<string>('CORS_ORIGIN') || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

console.log('✅ Allowed Origins:', corsOrigins);

app.enableCors({
  origin: corsOrigins, // <--- pakai list dari env
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
});


  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('A RESTful API for managing tasks')
    .setVersion('1.0')
    .addTag('tasks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('PORT', 3000);
  const host = configService.get<string>('HOST', '0.0.0.0');
  await app.listen(port, host);

  console.log(`Application is running on: http://${host}:${port}`);
  console.log(`Swagger docs: http://${host}:${port}/api`);
}

bootstrap();
