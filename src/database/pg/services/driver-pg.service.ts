import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { DriverEntity } from '../entities';
import { IDriver } from '../../../types';

@Injectable()
export class DriverPgService {
  constructor(
    @InjectRepository(DriverEntity)
    private driverRepository: Repository<DriverEntity>,
  ) {}

  public async create(
    data: Omit<IDriver, 'id' | 'lastOnline' | 'latitude' | 'longitude'>,
  ): Promise<DriverEntity> {
    const { raw } = await this.driverRepository.upsert(
      {
        ...data,
        lastOnline: new Date(),
        createdAt: new Date(),
      },
      ['user'],
    );

    const driver = await this.driverRepository.findOne({
      where: {
        id: raw[0].id,
      },
      relations: ['transportType'],
    });
    if (!driver) {
      throw new Error('Create driver failed');
    }

    return driver;
  }

  public async findByUserId(userId: number): Promise<IDriver | null> {
    return this.driverRepository.findOne({
      where: {
        user: { id: userId },
      },
      relations: ['transportType'],
    });
  }

  public async updateLocation(
    driver: IDriver,
    latitude: number,
    longitude: number,
  ) {
    driver.latitude = `${latitude}`;
    driver.longitude = `${longitude}`;
    driver.lastOnline = new Date();

    await this.driverRepository.save(driver, {
      reload: false,
    });
  }

  public async getById(id: number): Promise<IDriver | null> {
    return this.driverRepository.findOne({
      where: {
        id,
      },
      relations: ['transportType'],
    });
  }

  public async update(id: number, data: Partial<IDriver>) {
    await this.driverRepository.update({ id }, data);
  }

  public async getAllOnline(onlinePeriodSec: number): Promise<IDriver[]> {
    return this.driverRepository.find({
      where: {
        lastOnline: onlinePeriodSec
          ? MoreThan(new Date(Date.now() - onlinePeriodSec * 1000))
          : undefined,
      },
      relations: ['transportType'],
    });
  }
}
