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
  const loggerOptions = [winston.format.timestamp()];

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            ...loggerOptions,
            nestWinstonModuleUtilities.format.nestLike('Server', {
              prettyPrint: true,
            }),
          ),
        }),
        new winston.transports.File({
          format: winston.format.combine(
            ...loggerOptions,
            winston.format.simple(),
          ),
          filename: 'combined.log',
        }),
      ],
    }),
  });
  app.enableCors({
    origin: process.env.CORS_ALLOW_ORIGIN,
  });
  await app.listen(3001);
}
bootstrap();
