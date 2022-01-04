import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import { Statistics } from '@open-birdhouse/common';

const DB_FILE = './statisticsDB.json';

@Injectable()
export class StatisticsService {
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
}
