import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS tanpa kondisi
  app.enableCors({
    origin: true, // auto reflect Origin header
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(3000, '0.0.0.0');
  console.log(`🚀 Server running at http://0.0.0.0:3000`);
}
bootstrap();
