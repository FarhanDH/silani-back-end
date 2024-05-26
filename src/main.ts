import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { config } from './common/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');

  const logger: Logger = new Logger('Info');
  const port: number = config().serverPort || 3000;
  await app
    .listen(port)
    .then(() => logger.log(`server started 🚀 on port ${port}`));
}
bootstrap();
