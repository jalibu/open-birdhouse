import { Injectable } from '@nestjs/common';
import * as rpio from 'rpio';
import { ControlsStatus } from '@open-birdhouse/common';

@Injectable()
export class ControlsService {
  private PIN_NIGHTVISION;
  private PIN_OUT;
  private PIN_RED;
  private PIN_GREEN;
  private PIN_BLUE;

  constructor() {
    this.PIN_NIGHTVISION = parseInt(process.env.PIN_NIGHTVISION);
    this.PIN_OUT = parseInt(process.env.PIN_OUT);
    this.PIN_RED = parseInt(process.env.PIN_RED);
    this.PIN_GREEN = parseInt(process.env.PIN_GREEN);
    this.PIN_BLUE = parseInt(process.env.PIN_BLUE);

    rpio.open(this.PIN_NIGHTVISION, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.PIN_OUT, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.PIN_RED, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.PIN_GREEN, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.PIN_BLUE, rpio.OUTPUT, rpio.LOW);
  }
  data: any = {
    nightVisionOn: false,
    roomLightOn: false,
    roomLightColor: 'white',
    outdoorLightOn: false,
  };

  getControls(): ControlsStatus {
    return this.data;
  }

  setControls(newData: ControlsStatus): ControlsStatus {
    this.data = newData;

    if (newData.outdoorLightOn) {
      rpio.write(this.PIN_OUT, rpio.HIGH);
    } else {
      rpio.write(this.PIN_OUT, rpio.LOW);
    }

    if (newData.nightVisionOn) {
      rpio.write(this.PIN_NIGHTVISION, rpio.HIGH);
    } else {
      rpio.write(this.PIN_NIGHTVISION, rpio.LOW);
    }

    if (newData.roomLightOn) {
      switch (newData.roomLightColor) {
        case 'RED':
          rpio.write(this.PIN_BLUE, rpio.LOW);
          rpio.write(this.PIN_GREEN, rpio.LOW);
          rpio.write(this.PIN_RED, rpio.HIGH);
          break;
        case 'GREEN':
          rpio.write(this.PIN_BLUE, rpio.LOW);
          rpio.write(this.PIN_GREEN, rpio.HIGH);
          rpio.write(this.PIN_RED, rpio.LOW);
          break;
        case 'BLUE':
          rpio.write(this.PIN_BLUE, rpio.HIGH);
          rpio.write(this.PIN_GREEN, rpio.LOW);
          rpio.write(this.PIN_RED, rpio.LOW);
          break;
        case 'CYAN':
          rpio.write(this.PIN_BLUE, rpio.HIGH);
          rpio.write(this.PIN_GREEN, rpio.HIGH);
          rpio.write(this.PIN_RED, rpio.LOW);
          break;
        case 'MAGENTA':
          rpio.write(this.PIN_BLUE, rpio.HIGH);
          rpio.write(this.PIN_GREEN, rpio.LOW);
          rpio.write(this.PIN_RED, rpio.HIGH);
          break;
        default:
          rpio.write(this.PIN_BLUE, rpio.HIGH);
          rpio.write(this.PIN_GREEN, rpio.HIGH);
          rpio.write(this.PIN_RED, rpio.HIGH);
      }
    } else {
      rpio.write(this.PIN_RED, rpio.LOW);
      rpio.write(this.PIN_BLUE, rpio.LOW);
      rpio.write(this.PIN_GREEN, rpio.LOW);
    }

    return this.data;
  }
}
