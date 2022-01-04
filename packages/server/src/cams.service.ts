import { Injectable } from '@nestjs/common';
import { Cam } from '@open-birdhouse/common';

@Injectable()
export class CamsService {
  private cams: Cam[];

  constructor() {
    this.cams = JSON.parse(process.env.CAMS);
  }

  getCams(): Cam[] {
    return this.cams;
  }
}
