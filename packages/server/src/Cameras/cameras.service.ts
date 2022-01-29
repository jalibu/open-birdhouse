import { Injectable, Logger } from '@nestjs/common';
import { Camera } from '@open-birdhouse/common';

@Injectable()
export class CamerasService {
  private cameras: Camera[];

  constructor(private readonly logger: Logger) {
    this.cameras = JSON.parse(process.env.CAMS);
  }

  getCameras(): Camera[] {
    return this.cameras;
  }
}
