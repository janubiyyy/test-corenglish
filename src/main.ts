import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Ambil dari Railway env
  const allowedOrigins = (configService.get<string>('CORS_ORIGIN') || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  console.log('✅ Allowed Origins:', allowedOrigins);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error('❌ Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('A RESTful API for managing tasks')
    .setVersion('1.0')
    .addTag('tasks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 App running at http://localhost:${port}`);
}
bootstrap();
