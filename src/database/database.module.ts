import { Global, Module } from '@nestjs/common';
import { DriversDbService } from './services';

@Module({
  providers: [DriversDbService],
  exports: [DriversDbService],
})
@Global()
export class DatabaseModule {}
