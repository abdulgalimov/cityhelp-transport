import { Controller, Get, Inject, Query, Render } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ViewService } from './view.service';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Controller()
export class ViewController {
  constructor(
    @Inject(ViewService)
    private viewService: ViewService,
  ) {}

  @Get()
  async main() {
    return { description: 'main page' };
  }

  @Get('login')
  @Render('login')
  async indexPage() {
    return this.viewService.login();
  }

  @Get('register-driver')
  @Render('register-driver/index')
  registerDriver() {
    return this.viewService.registerDriver();
  }

  @Get('update-driver')
  @Render('update-driver/index')
  updateDriver(@Query() query: UpdateDriverDto) {
    return this.viewService.updateDriver(
      plainToInstance(UpdateDriverDto, query),
    );
  }
}
