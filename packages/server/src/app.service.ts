import { Injectable } from '@nestjs/common';
import * as rpio from 'rpio';
import * as fs from 'fs';
import { Cam, ControlsStatus, Statistics } from '@open-birdhouse/common';
import { Video } from '@open-birdhouse/common';

const DB_FILE = './statisticsDB.json';

const PIN_NIGHTVISION = 7;
const PIN_OUT = 29;
const PIN_RED = 37;
const PIN_GREEN = 35;
const PIN_BLUE = 33;

rpio.open(PIN_NIGHTVISION, rpio.OUTPUT, rpio.LOW);
rpio.open(PIN_OUT, rpio.OUTPUT, rpio.LOW);
rpio.open(PIN_RED, rpio.OUTPUT, rpio.LOW);
rpio.open(PIN_GREEN, rpio.OUTPUT, rpio.LOW);
rpio.open(PIN_BLUE, rpio.OUTPUT, rpio.LOW);

@Injectable()
export class AppService {
  data: any = {
    nightVisionOn: false,
    roomLightOn: false,
    roomLightColor: 'white',
    outdoorLightOn: false,
  };

  statisticsInMemory: Statistics = JSON.parse(
    fs.readFileSync(DB_FILE, 'utf-8'),
  );

  getStatistics(headers: any): Statistics {
    const now = new Date();

    if (!this.statisticsInMemory.visitors) {
      this.statisticsInMemory.visitors = {
        today: [],
        todayCalls: 0,
        yesterday: [],
        yesterdayCalls: 0,
      };
    }

    const existingVisitor = this.statisticsInMemory.visitors.today.find(
      (visitor) => visitor.id === headers['user-agent'],
    );

    if (
      this.statisticsInMemory.visitors.today.length > 0 &&
      now.getDate() !== this.statisticsInMemory.visitors.today[0].date
    ) {
      this.statisticsInMemory.visitors.yesterday =
        this.statisticsInMemory.visitors.today;
      this.statisticsInMemory.visitors.yesterdayCalls =
        this.statisticsInMemory.visitors.todayCalls;
      this.statisticsInMemory.visitors.today = [];
      this.statisticsInMemory.visitors.todayCalls = 0;
    }

    this.statisticsInMemory.visitors.todayCalls++;

    if (!existingVisitor) {
      this.statisticsInMemory.visitors.today.push({
        id: headers['user-agent'],
        date: now.getDate(),
      });
    }

    try {
      fs.writeFile(DB_FILE, JSON.stringify(this.statisticsInMemory), () => {
        // done
      });
    } catch (err) {
      console.log(err);
    }
    return this.statisticsInMemory;
  }
  // sleep time expects milliseconds
  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  getCams(): Cam[] {
    return [
      { id: 1, name: 'Außenkamera', url: 'http://192.168.178.199/cam' },
      { id: 2, name: 'Innenkamera', url: 'http://192.168.178.199/cam2' },
    ];
  }

  getControls(): ControlsStatus {
    return this.data;
  }

  async getGalery(): Promise<Video[]> {
    const galery: Video[] = [];
    /*
    //const VIDEO_DIR = '/var/www/html/galery';
    const VIDEO_DIR =
      '/Users/I543928/git/birdhouse-cam/birdhouse-ui/public/galery';


      const files = fs.readdirSync(VIDEO_DIR);
    const thumbnails = files.filter((file) => file.endsWith('.jpg'));
    for (const thumbnail of thumbnails) {
      const filename = thumbnail.replace('.jpg', '');
      if (files.includes(`${filename}.mp4`)) {
        const stream = fs.createReadStream(`${VIDEO_DIR}/${filename}.mp4`);
        const lengthInSeconds = 
        if (lengthInSeconds < 10) {
          try {
            fs.unlink(`${VIDEO_DIR}/${filename}.mp4`, () => {
              // done
            });
            fs.unlink(`${VIDEO_DIR}/${filename}.jpg`, () => {
              // done
            });
          } catch (err) {
            console.log('Error deleting videos');
          }
          continue;
        }

        const dateParts = filename.split('-');
        const date = new Date(
          Number(dateParts[0]),
          Number(dateParts[1]) - 1,
          Number(dateParts[2]),
          Number(dateParts[6]),
          Number(dateParts[7]),
        );

        galery.push({
          imageUrl: thumbnail,
          videoUrl: `${filename}.mp4`,
          date,
          lengthInSeconds,
        });
      }
    }
    galery.sort((a, b) => {
      if (a.date > b.date) {
        return -1;
      } else {
        1;
      }
    });
    */
    return galery;
  }

  setControls(newData: ControlsStatus): ControlsStatus {
    this.data = newData;

    console.log('Data', this.data);

    if (newData.outdoorLightOn) {
      rpio.write(PIN_OUT, rpio.HIGH);
    } else {
      rpio.write(PIN_OUT, rpio.LOW);
    }

    if (newData.nightVisionOn) {
      console.log('Nightvision an');
      rpio.write(PIN_NIGHTVISION, rpio.HIGH);
    } else {
      rpio.write(PIN_NIGHTVISION, rpio.LOW);
    }

    if (newData.roomLightOn) {
      switch (newData.roomLightColor) {
        case 'red':
          rpio.write(PIN_BLUE, rpio.LOW);
          rpio.write(PIN_GREEN, rpio.LOW);
          rpio.write(PIN_RED, rpio.HIGH);
          break;
        case 'green':
          rpio.write(PIN_BLUE, rpio.LOW);
          rpio.write(PIN_GREEN, rpio.HIGH);
          rpio.write(PIN_RED, rpio.LOW);
          break;
        case 'blue':
          rpio.write(PIN_BLUE, rpio.HIGH);
          rpio.write(PIN_GREEN, rpio.LOW);
          rpio.write(PIN_RED, rpio.LOW);
          break;
        case 'cyan':
          rpio.write(PIN_BLUE, rpio.HIGH);
          rpio.write(PIN_GREEN, rpio.HIGH);
          rpio.write(PIN_RED, rpio.LOW);
          break;
        case 'magenta':
          rpio.write(PIN_BLUE, rpio.HIGH);
          rpio.write(PIN_GREEN, rpio.LOW);
          rpio.write(PIN_RED, rpio.HIGH);
          break;
        default:
          rpio.write(PIN_BLUE, rpio.HIGH);
          rpio.write(PIN_GREEN, rpio.HIGH);
          rpio.write(PIN_RED, rpio.HIGH);
      }
    } else {
      rpio.write(PIN_RED, rpio.LOW);
      rpio.write(PIN_BLUE, rpio.LOW);
      rpio.write(PIN_GREEN, rpio.LOW);
    }

    return this.data;
  }
}
