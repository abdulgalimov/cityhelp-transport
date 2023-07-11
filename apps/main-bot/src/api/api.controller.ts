import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiService } from './api.service';

@ApiTags('Api')
@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('ping')
  ping() {
    return this.apiService.ping();
  }
}
