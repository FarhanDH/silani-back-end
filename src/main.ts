import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger: Logger = new Logger('Info');
  const port: number = 3000;
  await app
    .listen(port)
    .then(() => logger.log(`server started 🚀 on port ${port}`));
}
bootstrap();
