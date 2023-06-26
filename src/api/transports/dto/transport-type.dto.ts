import { ITransportType } from '../../../types';
import { ApiProperty } from '@nestjs/swagger';

export class TransportTypeDto implements ITransportType {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;
}
