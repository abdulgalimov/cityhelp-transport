import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { DriverPgService } from '../../pg/services';
import { IDriver, IFoundDriver } from '../../../types';
import { IEsDriver, IFindOptions } from './types';
import { getFindBody } from './body/find.body';

const IndexName = 'drivers';

@Injectable()
export class DriverEsService {
  constructor(
    private readonly es: ElasticsearchService,
    private readonly driversPgService: DriverPgService,
  ) {}

  public async reindex() {
    try {
      await this.es.indices.delete({
        index: IndexName,
      });
    } catch (err) {}

    await this.es.indices.create({
      index: IndexName,
      mappings: {
        properties: {
          id: { type: 'text' },
          transport: {
            properties: {
              title: { type: 'text' },
              id: { type: 'keyword' },
            },
          },
          fullName: { type: 'text' },
          carNumber: { type: 'text' },
          phoneNumber: { type: 'text' },
          location: { type: 'geo_point', doc_values: true },
          lastOnline: { type: 'date' },
        },
      },
    });

    const drivers = await this.driversPgService.getAllOnline(0);

    await Promise.all(drivers.map((driver) => this.createDriver(driver)));

    return {
      onlineCount: drivers.length,
    };
  }

  public async createDriver(driver: IDriver) {
    const document: IEsDriver = {
      id: driver.id,
      transport: {
        id: driver.transportType.id,
        title: driver.transportType.title,
      },
      fullName: driver.fullName,
      carNumber: driver.carNumber,
      phoneNumber: driver.phone,
      location: {
        lat: +driver.latitude,
        lon: +driver.longitude,
      },
      lastOnline: driver.lastOnline.getTime(),
    };

    await this.es.index({
      index: IndexName,
      id: `${driver.id}`,
      document,
    });
  }

  public async find(options: IFindOptions): Promise<IFoundDriver[]> {
    const body = getFindBody(options);
    const res = await this.es.search<IEsDriver>({
      index: IndexName,
      ...body,
    });
    console.log('res');
    console.dir(res, { depth: 20 });
    const tasks = res.hits.hits.map(async (h) => {
      const esDriver = h._source!;

      const distance =
        h.fields && h.fields.distance?.length ? h.fields.distance[0] : 0;

      const driver: IDriver | null = await this.driversPgService.getById(
        esDriver.id,
      );
      if (!driver) {
        return;
      }
      return {
        driver,
        distance,
      };
    });
    return (await Promise.all(tasks)).filter((res) => !!res) as IFoundDriver[];
  }

  public async updateLocation(driver: IDriver) {
    /*
    await this.es.update({
      id: driver.id.toString(),
      location: {
        lat: +driver.latitude,
        lon: +driver.longitude,
      },
    });
     */
  }
}
