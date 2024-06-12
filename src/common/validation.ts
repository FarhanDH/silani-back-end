import { Logger, NotFoundException } from '@nestjs/common';

export class Validation {
  private static readonly logger: Logger = new Logger(Validation.name);

  static uuid(id: string): boolean {
    this.logger.debug(`Validation.uuid(${id})`);
    const idPattern =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    if (!idPattern.test(id)) {
      this.logger.error(`Validation.uuid(${id}) not found`);
      throw new NotFoundException(`${id} not found`);
    }
    return true;
  }
}
