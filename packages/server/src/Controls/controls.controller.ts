import { Body, Controller, Get, Post } from '@nestjs/common';
import { ControlsService } from './controls.service';

@Controller()
export class ControlsController {
  constructor(private readonly controlsService: ControlsService) {}

  @Get('/api/controls')
  getControls(): any {
    return this.controlsService.getControls();
  }

  @Post('/api/controls')
  setControls(@Body() data): any {
    return this.controlsService.setControls(data);
  }
}
