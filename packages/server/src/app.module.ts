import { Module } from '@nestjs/common';
import { AppController } from './cams.controller';
import { CamsService } from './cams.service';
import { ControlsController } from './controls.controller';
import { ControlsService } from './controls.service';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    ControlsController,
    GalleryController,
    StatisticsController,
  ],
  providers: [CamsService, ControlsService, GalleryService, StatisticsService],
})
export class AppModule {}
