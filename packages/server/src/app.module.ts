import { Module } from '@nestjs/common';
import { AppController } from './cams.controller';
import { CamsService } from './cams.service';
import { ControlsController } from './controls.controller';
import { ControlsService } from './controls.service';
import { DatabaseService } from './database.service';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    ControlsController,
    GalleryController,
    StatisticsController,
    WeatherController,
  ],
  providers: [
    CamsService,
    ControlsService,
    DatabaseService,
    GalleryService,
    StatisticsService,
    WeatherService,
  ],
})
export class AppModule {}
