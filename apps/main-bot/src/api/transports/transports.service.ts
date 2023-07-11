import { Injectable, Logger } from '@nestjs/common';
import {
  CreateTransportTypeDto,
  DeleteTransportTypeDto,
  TransportTypeDto,
} from './dto';
import { TransportTypePgService } from '../../database/pg/services';

@Injectable()
export class TransportsService {
  constructor(private transportTypePgService: TransportTypePgService) {}

  private logger: Logger = new Logger('TransportsService');

  public async create(dto: CreateTransportTypeDto): Promise<TransportTypeDto> {
    this.logger.log('create', dto);
    return this.transportTypePgService.create(dto);
  }

  public async delete(dto: DeleteTransportTypeDto) {
    this.logger.log('delete', dto);
    return this.transportTypePgService.delete(dto.id);
  }

  public async getAll(): Promise<TransportTypeDto[]> {
    return this.transportTypePgService.getAll();
  }
}
