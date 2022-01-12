import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import * as dotenv from 'dotenv-flow';
dotenv.config();

async function bootstrap() {
  const loggerOptions = {
    format: winston.format.combine(
      winston.format.timestamp(),
      nestWinstonModuleUtilities.format.nestLike('Server', {
        prettyPrint: true,
      }),
    ),
  };
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console(loggerOptions),
        new winston.transports.File({
          ...loggerOptions,
          filename: 'error.log',
          level: 'error',
        }),
        new winston.transports.File({
          ...loggerOptions,
          filename: 'combined.log',
        }),
      ],
      // other options
    }),
  });
  app.enableCors({
    origin: process.env.CORS_ALLOW_ORIGIN,
  });
  await app.listen(3001);
}
bootstrap();
