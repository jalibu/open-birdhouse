import { Injectable } from '@nestjs/common';
import { Statistics } from '@open-birdhouse/common';
import { DatabaseService } from './database.service';
import { GalleryService } from './gallery.service';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly galleryService: GalleryService,
  ) {}

  getStatistics(headers: any): Statistics {
    const statistics = this.databaseService.getStatistics() || {
      visitors: {
        today: [],
        todayCalls: 0,
        yesterday: [],
        yesterdayCalls: 0,
      },
      animals: null,
    };

    try {
      statistics.animals = {
        todayCalls: this.galleryService
          .getGalery()
          .videos.filter((video) => video.date.getDay() === new Date().getDay())
          .length,
      };
    } catch (err) {
      console.log('err', err);
    }

    const now = new Date();

    const existingVisitor = statistics.visitors.today.find(
      (visitor) => visitor.id === headers['user-agent'],
    );

    if (
      statistics.visitors.today.length > 0 &&
      now.getDate() !== statistics.visitors.today[0].date
    ) {
      statistics.visitors.yesterday = statistics.visitors.today;
      statistics.visitors.yesterdayCalls = statistics.visitors.todayCalls;
      statistics.visitors.today = [];
      statistics.visitors.todayCalls = 0;
    }

    statistics.visitors.todayCalls++;

    if (!existingVisitor) {
      statistics.visitors.today.push({
        id: headers['user-agent'],
        date: now.getDate(),
      });
    }

    this.databaseService.setStatistics(statistics);

    return statistics;
  }
}
