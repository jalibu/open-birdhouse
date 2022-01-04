import { Controller, Get } from '@nestjs/common';
import { CamsService } from './cams.service';

@Controller()
export class AppController {
  constructor(private readonly camsService: CamsService) {}

  @Get('/api/cams')
  getCams(): any {
    return this.camsService.getCams();
  }
}
