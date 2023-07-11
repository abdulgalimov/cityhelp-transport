import { Inject, Injectable } from '@nestjs/common';
import {
  DriverPgService,
  TransportTypePgService,
} from '../database/pg/services';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { IDriver } from '../types';

@Injectable()
export class ViewService {
  @Inject(TransportTypePgService)
  private transportTypePgService: TransportTypePgService;

  @Inject(DriverPgService)
  private driverPgService: DriverPgService;

  login() {
    return {
      botUsername: 'test',
    };
  }

  async registerDriver() {
    return {
      transportTypes: await this.transportTypePgService.getAll(),
    };
  }

  async updateDriver(query: UpdateDriverDto) {
    const { driverId } = query;

    const driver: IDriver | null = await this.driverPgService.getById(driverId);
    if (!driver) {
      // todo show 404 error
      return {};
    }

    const transportTypes = await this.transportTypePgService.getAll();
    const transportTypesWithSelected = transportTypes.map((type) => {
      return {
        ...type,
        selected: type.id === driver.transportType.id,
      };
    });

    return {
      transportTypes: transportTypesWithSelected,
      driver,
    };
  }
}
