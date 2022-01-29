import { Module, Logger } from '@nestjs/common';
import { AppController } from './Cameras/cameras.controller';
import { CamerasService } from './Cameras/cameras.service';
import { ControlsController } from './Controls/controls.controller';
import { ControlsService } from './Controls/controls.service';
import { DatabaseService } from './database.service';
import { GalleryController } from './Gallery/gallery.controller';
import { GalleryService } from './Gallery/gallery.service';
import { StatisticsController } from './Statistics/statistics.controller';
import { StatisticsService } from './Statistics/statistics.service';
import { WeatherController } from './Weather/weather.controller';
import { WeatherService } from './Weather/weather.service';
import { AppGateway } from './app.gateway';
import { UploaderService } from './Gallery/uploader.service';
import { AnnotationService } from './Gallery/annotation.service';

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
    AnnotationService,
    AppGateway,
    CamerasService,
    ControlsService,
    DatabaseService,
    GalleryService,
    Logger,
    StatisticsService,
    UploaderService,
    WeatherService,
  ],
})
export class AppModule {}
