import { Injectable, Logger } from '@nestjs/common';
import { DriversDbService } from '../../database/services';

@Injectable()
export class DriversService {
  constructor(private driverDbService: DriversDbService) {}

  private logger: Logger = new Logger('DriversService');

  public async reindexDb() {
    this.logger.log('reindexDb');
    return this.driverDbService.reindex();
  }
}
