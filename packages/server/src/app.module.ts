import { Module, Logger } from '@nestjs/common';
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
import { AppGateway } from './app.gateway';

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
    AppGateway,
    CamsService,
    ControlsService,
    DatabaseService,
    GalleryService,
    StatisticsService,
    WeatherService,
    Logger,
  ],
})
export class AppModule {}
