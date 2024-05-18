import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger: Logger = new Logger(AppService.name);
  getHello(): string {
    this.logger.verbose(`Get hello world response`);
    return 'Hello World!';
  }
}
