import { Injectable } from '@nestjs/common';
import {
  GenericControl,
  SwitchControl,
  RgbLedControl,
} from '@open-birdhouse/common';

import { AppGateway } from '../app.gateway';

@Injectable()
export class ControlsService {
  private controls: GenericControl[] = [];
  constructor(private readonly appGateway: AppGateway) {
    const configInput = JSON.parse(process.env.CONTROLS) as any[];

    configInput.forEach((entry) => {
      if (entry.type === 'RGB_LED') {
        this.controls.push(new RgbLedControl(entry));
      } else if (entry.type === 'SWITCH') {
        this.controls.push(new SwitchControl(entry));
      }
    });
  }

  private stripDownControls() {
    // yap, that's weird, but there is no other way to clone an array without references
    const copy = JSON.parse(JSON.stringify(this.controls));
    return copy.map((control) => {
      delete control.pins;
      return control;
    });
  }

  getControls(): GenericControl[] {
    const strippedDownControls = this.stripDownControls();
    this.appGateway.sendControlsUpdate(strippedDownControls);
    return strippedDownControls;
  }

  setControls(input: GenericControl[]): GenericControl[] {
    input.forEach((entry) => {
      const control = this.controls.find((control) => control.id === entry.id);
      if (control) {
        if (entry.type === 'SWITCH' && control.type === 'SWITCH') {
          const switchControl = control as SwitchControl;
          const switchControlInput = entry as SwitchControl;
          switchControlInput.isOn
            ? switchControl.switchOn()
            : switchControl.switchOff();
        } else if (entry.type === 'RGB_LED' && control.type === 'RGB_LED') {
          const switchControl = control as RgbLedControl;
          const switchControlInput = entry as RgbLedControl;
          switchControl.setColor(switchControlInput.color);
          switchControlInput.isOn
            ? switchControl.switchOn()
            : switchControl.switchOff();
        }
      }
    });

    return this.stripDownControls();
  }
}
