import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { DriversService } from './drivers.service';

@ApiTags('Drivers')
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post('reindex')
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  reindexDb() {
    return this.driversService.reindexDb();
  }
}
