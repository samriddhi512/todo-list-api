import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();

// starts nestjs app with appModule as the entry point.
// like index.js in express app.
