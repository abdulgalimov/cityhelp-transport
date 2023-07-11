import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { TransportsController, TransportsService } from './transports';
import { DriversController, DriversService } from './drivers';
import { EsModule } from '../database/es';

@Module({
  imports: [EsModule],
  controllers: [ApiController, TransportsController, DriversController],
  providers: [ApiService, TransportsService, DriversService],
})
export class ApiModule {}
