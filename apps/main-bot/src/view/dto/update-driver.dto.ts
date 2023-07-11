import { Type } from 'class-transformer';

export class UpdateDriverDto {
  @Type(() => Number)
  driverId: number;
}
