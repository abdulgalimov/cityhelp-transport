import { Module } from '@nestjs/common';
import { ViewController } from './view.controller';
import { ViewService } from './view.service';
import { PgModule } from '../database/pg';

@Module({
  imports: [PgModule],
  controllers: [ViewController],
  providers: [ViewService],
})
export class ViewModule {}
