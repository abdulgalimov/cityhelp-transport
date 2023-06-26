import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { ITransportType } from '../../../types';

export class CreateTransportTypeDto implements Omit<ITransportType, 'id'> {
  @ApiProperty()
  @IsString()
  title: string;
}

export class DeleteTransportTypeDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}
