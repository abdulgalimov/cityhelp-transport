import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransportTypeEntity } from '../entities';

@Injectable()
export class TransportTypePgService {
  constructor(
    @InjectRepository(TransportTypeEntity)
    private transportTypeRepository: Repository<TransportTypeEntity>,
  ) {}

  public async create(
    data: Omit<TransportTypeEntity, 'id'>,
  ): Promise<TransportTypeEntity> {
    const entity = this.transportTypeRepository.create(data);

    await this.transportTypeRepository.insert(entity);

    return entity;
  }

  public async delete(id: number) {
    await this.transportTypeRepository.delete({
      id,
    });
  }

  public async getAll(): Promise<TransportTypeEntity[]> {
    return this.transportTypeRepository.find();
  }

  public getById(id): Promise<TransportTypeEntity | null> {
    return this.transportTypeRepository.findOne({
      where: {
        id,
      },
    });
  }
}
