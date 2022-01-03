import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv-flow';
dotenv.config();

async function bootstrap() {
  console.log('process.env.CORS_ALLOW_ORIGIN', process.env.CORS_ALLOW_ORIGIN);
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ALLOW_ORIGIN,
  });
  await app.listen(3001);
}
bootstrap();
