import { Controller, Get } from '@nestjs/common';
import { Camera } from '@open-birdhouse/common';
import { CamerasService } from './cameras.service';

@Controller()
export class AppController {
  constructor(private readonly camsService: CamerasService) {}

  @Get('/api/cams')
  getCameras(): Camera[] {
    return this.camsService.getCameras();
  }
}
