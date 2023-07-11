import { Controller, Post, Body, Get, UseGuards, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransportsService } from './transports.service';
import { CreateTransportTypeDto, DeleteTransportTypeDto } from './dto';
import { TransportTypeDto } from './dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Transports')
@Controller('transports')
export class TransportsController {
  constructor(private readonly transportsService: TransportsService) {}

  @Post()
  @ApiBody({
    type: CreateTransportTypeDto,
  })
  @ApiResponse({
    type: TransportTypeDto,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  createTransportType(@Body() dto: CreateTransportTypeDto) {
    return this.transportsService.create(dto);
  }

  @Delete()
  @ApiBody({
    type: DeleteTransportTypeDto,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  deleteTransportType(@Body() dto: DeleteTransportTypeDto) {
    return this.transportsService.delete(dto);
  }

  @Get()
  @ApiResponse({
    type: TransportTypeDto,
    isArray: true,
  })
  getList() {
    return this.transportsService.getAll();
  }
}
