import { Injectable } from '@nestjs/common';
import { DriverPgService } from '../pg/services';
import { DriverEsService, IFindOptions } from '../es/drivers';
import { ICreateDriver, IDriver, IFoundDriver } from '../../types';

@Injectable()
export class DriversDbService {
  constructor(
    private driverPgService: DriverPgService,
    private driverEsService: DriverEsService,
  ) {}

  public async reindex() {
    return this.driverEsService.reindex();
  }

  public async create(data: ICreateDriver): Promise<IDriver> {
    const driver = await this.driverPgService.create(data);

    await this.driverEsService.createDriver(driver);

    return driver;
  }

  public async update(driver: IDriver, updateData: Partial<IDriver>) {
    Object.assign(driver, updateData);

    await Promise.all([
      this.driverPgService.update(driver.id, updateData),
      this.driverEsService.createDriver(driver),
    ]);
  }

  public async find(options: IFindOptions): Promise<IFoundDriver[]> {
    return this.driverEsService.find(options);
  }
}
