import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/api/cams')
  getCams(): any {
    return this.appService.getCams();
  }

  @Get('/api/controls')
  getControls(): any {
    return this.appService.getControls();
  }

  @Post('/api/controls')
  setControls(@Body() data): any {
    return this.appService.setControls(data);
  }

  @Get('/api/statistics')
  getStats(@Request() request): any {
    return this.appService.getStatistics(request.headers);
  }

  @Get('/api/galery')
  getGalery(): any {
    return this.appService.getGalery();
  }
}
