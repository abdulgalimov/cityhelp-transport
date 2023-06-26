import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ApiService {
  private logger: Logger = new Logger('ApiService');

  public ping() {
    this.logger.log('ping');
    return {
      ok: true,
      message: 'pong',
    };
  }
}
