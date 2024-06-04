import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { config } from './common/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const logger: Logger = new Logger('Info');
  const port: number = config().serverPort || 3000;
  await app
    .listen(port)
    .then(() => logger.log(`server started 🚀 on port ${port}`));
}
bootstrap();
