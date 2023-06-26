import { Injectable, Logger } from '@nestjs/common';
import { DriverEsService } from '../../database/es/drivers';

@Injectable()
export class DriversService {
  constructor(private driverEsService: DriverEsService) {}

  private logger: Logger = new Logger('DriversService');

  public async reindexDb() {
    this.logger.log('reindexDb');
    return this.driverEsService.reindex();
  }
}
