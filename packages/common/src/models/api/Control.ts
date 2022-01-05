import rpio from "rpio";

export class GenericControl {
  public id: string;
  public name: string;
  public type: string;
  public pins: { [key: string]: number } = {};
  constructor(input: any) {
    this.id = input.id;
    this.name = input.name;
    this.type = input.type;
  }

  protected initGpio() {
    for (const pinName in this.pins) {
      rpio.open(this.pins[pinName], rpio.OUTPUT, rpio.LOW);
    }
  }
}

export class SwitchControl extends GenericControl {
  public isOn = false;
  constructor(input: any) {
    super(input);
    this.pins["PIN"] = input.config.PIN;
    this.initGpio();
  }

  public switchOn() {
    this.isOn = true;
    rpio.write(this.pins["PIN"], rpio.HIGH);
  }

  public switchOff() {
    this.isOn = false;
    rpio.write(this.pins["PIN"], rpio.LOW);
  }

  public toggle() {
    this.isOn ? this.switchOff() : this.switchOn();
  }
}

export class RgbLedControl extends GenericControl {
  public color: string = "WHITE";
  public isOn = false;

  constructor(input: any) {
    super(input);
    this.pins["PIN_RED"] = input.config.PIN_RED;
    this.pins["PIN_GREEN"] = input.config.PIN_GREEN;
    this.pins["PIN_BLUE"] = input.config.PIN_BLUE;
    this.initGpio();
  }

  private switchLeds() {
    if (this.isOn) {
      switch (this.color) {
        case "RED":
          rpio.write(this.pins["PIN_BLUE"], rpio.LOW);
          rpio.write(this.pins["PIN_GREEN"], rpio.LOW);
          rpio.write(this.pins["PIN_RED"], rpio.HIGH);
          break;
        case "GREEN":
          rpio.write(this.pins["PIN_BLUE"], rpio.LOW);
          rpio.write(this.pins["PIN_GREEN"], rpio.HIGH);
          rpio.write(this.pins["PIN_RED"], rpio.LOW);
          break;
        case "BLUE":
          rpio.write(this.pins["PIN_BLUE"], rpio.HIGH);
          rpio.write(this.pins["PIN_GREEN"], rpio.LOW);
          rpio.write(this.pins["PIN_RED"], rpio.LOW);
          break;
        case "CYAN":
          rpio.write(this.pins["PIN_BLUE"], rpio.HIGH);
          rpio.write(this.pins["PIN_GREEN"], rpio.HIGH);
          rpio.write(this.pins["PIN_RED"], rpio.LOW);
          break;
        case "MAGENTA":
          rpio.write(this.pins["PIN_BLUE"], rpio.HIGH);
          rpio.write(this.pins["PIN_GREEN"], rpio.LOW);
          rpio.write(this.pins["PIN_RED"], rpio.HIGH);
          break;
        default:
          rpio.write(this.pins["PIN_BLUE"], rpio.HIGH);
          rpio.write(this.pins["PIN_GREEN"], rpio.HIGH);
          rpio.write(this.pins["PIN_RED"], rpio.HIGH);
      }
    } else {
      rpio.write(this.pins["PIN_RED"], rpio.LOW);
      rpio.write(this.pins["PIN_BLUE"], rpio.LOW);
      rpio.write(this.pins["PIN_GREEN"], rpio.LOW);
    }
  }

  public setColor(color: string) {
    this.color = color;
    this.switchLeds();
  }

  public switchOn() {
    this.isOn = true;
    this.switchLeds();
  }

  public switchOff() {
    this.isOn = false;
    this.switchLeds();
  }
}
